import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-dash-new-tarea',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatInputModule, MatIconModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './admin-dash-new-tarea.component.html',
  styleUrl: './admin-dash-new-tarea.component.css'
})
export class AdminDashNewTareaComponent {
  tareaForm: FormGroup;
  estados = ['COMPLETADA', 'EN_PROGRESO', 'PENDIENTE'];
  blacklistedWords = ['jolines', 'joder'];

  constructor(
    private fb: FormBuilder,
    private tareaService: TareaService,
    private location: Location
  ) {
    this.tareaForm = this.fb.group({
      nombre: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      descripcion: ['', this.blacklistValidator(this.blacklistedWords)],
      fechaVencimiento: ['', Validators.required],
      estado: ['', Validators.required],
      proyecto: this.fb.group({
        id: [window.localStorage.getItem('idProyecto')]
      })
    });
  }

  ngOnInit(): void {
    const proyectoId = window.localStorage.getItem('idProyecto');
    this.tareaForm.patchValue({ proyecto: { id: proyectoId } });
  }

  irAtras(): void {
    this.location.back();
  }

  crearTarea(): void {
    if (this.tareaForm.valid) {
      const token = localStorage.getItem('token');
      const newTarea = {
        nombre: this.tareaForm.value.nombre,
        descripcion: this.tareaForm.value.descripcion,
        fechaVencimiento: this.tareaForm.value.fechaVencimiento,
        estado: this.tareaForm.value.estado,
        proyecto: {
          id: this.tareaForm.value.proyecto.id
        }
      }
      console.log(newTarea)
      if (token) {
        this.tareaService.createTarea(newTarea, token).subscribe({
          next: () => {
            this.openModalCerrar();
          },
          error: (error: any) => {
            console.error('Error al crear la tarea', error);
          },
          complete: () => {
            console.log('Petición para crear la tarea completada');
          }
        });
      } else {
        console.error('Algo ocurrió con el token');
      }
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
