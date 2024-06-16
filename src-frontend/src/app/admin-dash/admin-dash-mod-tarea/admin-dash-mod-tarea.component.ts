import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-dash-mod-tarea',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, MatCardModule, MatInputModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-dash-mod-tarea.component.html',
  styleUrl: './admin-dash-mod-tarea.component.css'
})
export class AdminDashModTareaComponent implements OnInit {
  tareaForm: FormGroup;
  blacklistedWords = ['jolines', 'joder'];

  estados = ['COMPLETADA', 'EN_PROGRESO', 'PENDIENTE'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tareaService: TareaService,
    private location: Location
  ) {
    this.tareaForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      descripcion: ['', [this.blacklistValidator(this.blacklistedWords)]],
      fechaVencimiento: ['', Validators.required],
      estado: ['']
    });
  }

  ngOnInit(): void {
    this.getTarea();
  }

  getTarea(): void {
    const tareaID = Number(this.route.snapshot.paramMap.get('id'));
    const token = localStorage.getItem('token');
    if (token) {
      this.tareaService.getTarea(tareaID, token).subscribe({
        next: (data: any) => {
          this.tareaForm.patchValue({
            id: data.id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            fechaVencimiento: data.fechaVencimiento,
            estado: data.estado
          });
        },
        error: (error: any) => {
          console.error('Error al cargar la tarea', error);
        },
        complete: () => {
          console.log('Petición para obtener la tarea completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  irAtras(): void {
    this.location.back();
  }

  modificarTarea(): void {
    if (this.tareaForm.invalid) {
      this.tareaForm.markAllAsTouched();
      return;
    }
    const token = localStorage.getItem('token');
    if (token) {
      const formValue = this.tareaForm.value;
      const newTarea = {
        id: formValue.id,
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        fechaVencimiento: formValue.fechaVencimiento,
        estado: formValue.estado,
        proyecto: {
          id: window.localStorage.getItem('idProyecto') || ''
        }
      };
      this.tareaService.modTarea(newTarea, token).subscribe({
        next: () => {
          this.openModalCerrar();
        },
        error: (error: any) => {
          console.error('Error al guardar la tarea', error);
        },
        complete: () => {
          console.log('Petición para modificar la tarea completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  isModalCerrar = false;

  openModalCerrar() {
    this.isModalCerrar = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
  }

  blacklistValidator(blacklistedWords: string[]) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
        return null;
      }
      const hasBlacklistedWord = blacklistedWords.some(word => control.value.includes(word));
      return hasBlacklistedWord ? { blacklisted: true } : null;
    };
  }
}
