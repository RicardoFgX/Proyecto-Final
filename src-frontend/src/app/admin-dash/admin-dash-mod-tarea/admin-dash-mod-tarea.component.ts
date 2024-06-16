// Importaciones necesarias de Angular y otros módulos
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

// Decorador @Component para definir metadatos del componente
@Component({
  selector: 'app-admin-dash-mod-tarea', // Selector del componente
  standalone: true, // Indicador de que el componente es autónomo
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    RouterLink, 
    MatCardModule, 
    MatInputModule, 
    MatIconModule, 
    RouterLink, 
    RouterLinkActive
  ], // Módulos y componentes importados
  templateUrl: './admin-dash-mod-tarea.component.html', // Ruta al archivo de plantilla HTML
  styleUrl: './admin-dash-mod-tarea.component.css' // Ruta al archivo de estilos CSS
})
export class AdminDashModTareaComponent implements OnInit {
  // Declaración del formulario de la tarea y las palabras prohibidas
  tareaForm: FormGroup;
  blacklistedWords = ['jolines', 'joder'];

  // Estados posibles para la tarea
  estados = ['COMPLETADA', 'EN_PROGRESO', 'PENDIENTE'];

  // Constructor para inyectar servicios y form builder
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tareaService: TareaService,
    private location: Location
  ) {
    // Inicialización del formulario con validaciones
    this.tareaForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      descripcion: ['', [this.blacklistValidator(this.blacklistedWords)]],
      fechaVencimiento: ['', Validators.required],
      estado: ['']
    });
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.getTarea(); // Obtener los datos de la tarea a modificar
  }

  // Método para obtener los datos de la tarea a modificar
  getTarea(): void {
    const tareaID = Number(this.route.snapshot.paramMap.get('id')); // Obtener el ID de la tarea de los parámetros de la ruta
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.tareaService.getTarea(tareaID, token).subscribe({
        next: (data: any) => {
          // Asignar los datos de la tarea a los campos del formulario
          this.tareaForm.patchValue({
            id: data.id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            fechaVencimiento: data.fechaVencimiento,
            estado: data.estado
          });
        },
        error: (error: any) => {
          console.error('Error al cargar la tarea', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Método para volver a la vista anterior
  irAtras(): void {
    this.location.back();
  }

  // Método para modificar la tarea
  modificarTarea(): void {
    if (this.tareaForm.invalid) {
      this.tareaForm.markAllAsTouched(); // Marcar todos los campos como tocados si el formulario es inválido
      return;
    }
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      const formValue = this.tareaForm.value;
      const newTarea = {
        id: formValue.id,
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        fechaVencimiento: formValue.fechaVencimiento,
        estado: formValue.estado,
        proyecto: {
          id: window.localStorage.getItem('idProyecto') || '' // Obtener el ID del proyecto del almacenamiento local
        }
      };
      this.tareaService.modTarea(newTarea, token).subscribe({
        next: () => {
          this.openModalCerrar(); // Abrir el modal de confirmación de éxito
        },
        error: (error: any) => {
          console.error('Error al guardar la tarea', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Variables para controlar la visibilidad del modal
  isModalCerrar = false;

  // Métodos para abrir y cerrar el modal de acción satisfactoria
  openModalCerrar() {
    this.isModalCerrar = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
  }

  // Validador personalizado para palabras prohibidas
  blacklistValidator(blacklistedWords: string[]) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
        return null; // Si no hay valor, no hay error
      }
      const hasBlacklistedWord = blacklistedWords.some(word => control.value.includes(word)); // Verificar si hay palabras prohibidas
      return hasBlacklistedWord ? { blacklisted: true } : null; // Retornar error si se encuentra una palabra prohibida
    };
  }
}
