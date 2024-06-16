// Importaciones necesarias de Angular y otros módulos
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { NoteService } from '../../services/note.service';

// Decorador @Component para definir metadatos del componente
@Component({
  selector: 'app-admin-dash-new-note', // Selector del componente
  standalone: true, // Indicador de que el componente es autónomo
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule], // Módulos y componentes importados
  templateUrl: './admin-dash-new-note.component.html', // Ruta al archivo de plantilla HTML
  styleUrl: './admin-dash-new-note.component.css' // Ruta al archivo de estilos CSS
})
export class AdminDashNewNoteComponent implements OnInit {
  // Declaración del formulario de nota y la lista de usuarios
  notaForm: FormGroup;
  usuarios: any[] = [];
  blacklistedWords = ['jolines', 'joder'];

  // Objeto para almacenar el usuario seleccionado
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
    this.getAllUsers(); // Obtener la lista de usuarios
  }

  // Método para obtener la lista de usuarios
  getAllUsers() {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.userService.getAllUsers(token).subscribe({
        next: (data: any[]) => {
          this.usuarios = data; // Asignar los datos de los usuarios a la lista
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

  // Método para crear una nueva nota
  crearNota(): void {
    this.buscarIdUsuario(); // Buscar el ID del usuario seleccionado
    if (this.notaForm.valid) {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
      const newNote = {
        id: this.route.snapshot.paramMap.get('id'),
        titulo: this.notaForm.value.titulo,
        contenido: this.notaForm.value.contenido,
        usuario: {
          id: this.usuario.id
        }
      };
      if (token) {
        this.noteService.createNota(newNote, token).subscribe({
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


  // Método para buscar el ID del usuario seleccionado
  buscarIdUsuario(): void {
    if (this.notaForm.value.email) {
      const usuario = this.usuarios.find(u => u.email === this.notaForm.value.email);
      if (usuario) {
        this.usuario.id = usuario.id;
      }
    }
  }
}
