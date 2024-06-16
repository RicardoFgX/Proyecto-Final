// Importaciones necesarias de Angular y otros módulos
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { NoteService } from '../../services/note.service';

// Decorador @Component para definir metadatos del componente
@Component({
  selector: 'app-admin-dash-mod-notes', // Selector del componente
  standalone: true, // Indicador de que el componente es autónomo
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule], // Módulos y componentes importados
  templateUrl: './admin-dash-mod-notes.component.html', // Ruta al archivo de plantilla HTML
  styleUrl: './admin-dash-mod-notes.component.css' // Ruta al archivo de estilos CSS
})
export class AdminDashModNotesComponent implements OnInit {
  notaForm: FormGroup; // FormGroup para manejar el formulario de modificación de notas
  usuarios: any[] = []; // Array para almacenar los usuarios
  blacklistedWords = ['jolines', 'joder']; // Palabras prohibidas para validación

  usuario = {
    email: '',
    id: '',
  };

  // Constructor para inyectar servicios y form builder
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private noteService: NoteService
  ) {
    // Inicialización del formulario con validaciones
    this.notaForm = this.fb.group({
      titulo: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      contenido: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      email: ['', [Validators.required]]
    });
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.getAllUsers(); // Obtener todos los usuarios
    this.getNote(); // Obtener los datos de la nota a modificar
  }

  // Método para obtener todos los usuarios
  getAllUsers() {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.userService.getAllUsers(token).subscribe({
        next: (data: any[]) => {
          this.usuarios = data; // Asignar los datos obtenidos al array de usuarios
        },
        error: (error) => {
          console.error('Error al obtener la lista de usuarios:', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  // Método para obtener los datos de la nota a modificar
  getNote(): void {
    const noteID = Number(this.route.snapshot.paramMap.get('id')); // Obtener el ID de la nota de los parámetros de la ruta
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.noteService.getNota(noteID, token).subscribe({
        next: (data: any) => {
          // Asignar los datos de la nota a los campos del formulario
          this.notaForm.patchValue({
            titulo: data.titulo,
            contenido: data.contenido,
            email: data.usuario.email
          });
        },
        error: (error: any) => {
          console.error('Error al cargar la nota', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Método para modificar la nota
  modificarNota(): void {
    this.buscarIdUsuario(); // Buscar el ID del usuario asociado al email seleccionado
    if (this.notaForm.valid) {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
      const newNote = {
        id: this.route.snapshot.paramMap.get('id'), // Obtener el ID de la nota de los parámetros de la ruta
        titulo: this.notaForm.value.titulo, // Obtener el título del formulario
        contenido: this.notaForm.value.contenido, // Obtener el contenido del formulario
        usuario: {
          id: this.usuario.id // Asignar el ID del usuario seleccionado
        }
      };
      if (token) {
        this.noteService.modNota(newNote, token).subscribe({
          next: () => {
            this.openModalCerrar(); // Abrir el modal de confirmación de éxito
          },
          error: (error: any) => {
            console.error('Error al guardar la nota', error); // Manejar errores
          },
          complete: () => {
          }
        });
      } else {
        console.error('Algo ocurrió con el token');
      }
    }
  }

  // Método para navegar de vuelta a la lista de notas del administrador
  irAAdminDashNotas() {
    this.router.navigate(['/adminDash/notas']);
  }

  // Variables para controlar la visibilidad de los modales
  isModalCerrar = false;

  // Método para abrir el modal de acción satisfactoria
  openModalCerrar() {
    this.isModalCerrar = true;
  }

  // Método para cerrar el modal de acción satisfactoria
  closeModalCerrar() {
    this.isModalCerrar = false;
  }

  // Método para validar que no haya palabras prohibidas en los campos del formulario
  blacklistValidator(blacklistedWords: string[]) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
        return null; // Si no hay valor, no hay error
      }
      const hasBlacklistedWord = blacklistedWords.some(word => control.value.includes(word)); // Verificar si hay palabras prohibidas
      return hasBlacklistedWord ? { blacklisted: true } : null; // Retornar error si se encuentra una palabra prohibida
    };
  }

  // Método para buscar y asignar el ID del usuario asociado al email seleccionado en el formulario
  buscarIdUsuario(): void {
    if (this.notaForm.value.email) {
      const usuario = this.usuarios.find(u => u.email === this.notaForm.value.email); // Buscar el usuario por email
      if (usuario) {
        this.usuario.id = usuario.id; // Asignar el ID del usuario seleccionado
      }
    } 
  }
}
