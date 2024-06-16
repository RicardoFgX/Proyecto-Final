// Importaciones necesarias de Angular y otros módulos
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

// Decorador @Component para definir metadatos del componente
@Component({
  selector: 'app-admin-dash-new-tarea', // Selector del componente
  standalone: true, // Indicador de que el componente es autónomo
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatInputModule, MatIconModule, RouterLink, RouterLinkActive, ReactiveFormsModule], // Módulos y componentes importados
  templateUrl: './admin-dash-new-tarea.component.html', // Ruta al archivo de plantilla HTML
  styleUrl: './admin-dash-new-tarea.component.css' // Ruta al archivo de estilos CSS
})
export class AdminDashNewTareaComponent {
  // Declaración del formulario de tarea y los datos relacionados
  tareaForm: FormGroup;
  estados = ['COMPLETADA', 'EN_PROGRESO', 'PENDIENTE'];
  blacklistedWords = ['jolines', 'joder'];

  // Constructor para inyectar servicios y form builder
  constructor(
    private fb: FormBuilder,
    private tareaService: TareaService,
    private location: Location
  ) {
    // Inicialización del formulario con validaciones
    this.tareaForm = this.fb.group({
      nombre: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      descripcion: ['', this.blacklistValidator(this.blacklistedWords)],
      fechaVencimiento: ['', Validators.required],
      estado: ['', Validators.required],
      proyecto: this.fb.group({
        id: [window.localStorage.getItem('idProyecto')] // Obtener el ID del proyecto del almacenamiento local
      })
    });
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    const proyectoId = window.localStorage.getItem('idProyecto'); // Obtener el ID del proyecto del almacenamiento local
    this.tareaForm.patchValue({ proyecto: { id: proyectoId } }); // Asignar el ID del proyecto al formulario
  }

  // Método para navegar de vuelta a la vista anterior
  irAtras(): void {
    this.location.back();
  }

  // Método para crear una nueva tarea
  crearTarea(): void {
    if (this.tareaForm.valid) { // Verificar si el formulario es válido
      const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
      const newTarea = {
        nombre: this.tareaForm.value.nombre,
        descripcion: this.tareaForm.value.descripcion,
        fechaVencimiento: this.tareaForm.value.fechaVencimiento,
        estado: this.tareaForm.value.estado,
        proyecto: {
          id: this.tareaForm.value.proyecto.id
        }
      };
      if (token) {
        this.tareaService.createTarea(newTarea, token).subscribe({
          next: () => {
            this.openModalCerrar(); // Abrir el modal de confirmación de éxito
          },
          error: (error: any) => {
            console.error('Error al crear la tarea', error); // Manejar errores
          },
          complete: () => {
          }
        });
      } else {
        console.error('Algo ocurrió con el token');
      }
    }
  }

  // Propiedad para controlar la visibilidad del modal de confirmación
  isModalCerrar = false;

  // Métodos para abrir y cerrar el modal de confirmación
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
