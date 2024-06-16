import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoteService } from '../../../services/note.service';
import { UserServiceService } from '../../../services/user-service.service';

@Component({
  selector: 'app-user-mod-notes',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './user-mod-notes.component.html',
  styleUrls: ['./user-mod-notes.component.css']
})
export class UserModNotesComponent implements OnInit {
  notaForm: FormGroup; // Formulario reactivo para la nota

  // Lista de palabras prohibidas
  blacklistedWords = [
    'maricón', 'puto', 'joder', 'mierda', 'cabrón', 'cabron', 'bastardo'
  ];

  // Objeto para almacenar información del usuario
  usuario = {
    email: '',
    id: '',
  };

  usuarios: any[] = []; // Lista de usuarios

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
      contenido: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]]
    });
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.getAllUsers(); // Obtiene todos los usuarios
    this.getNote(); // Obtiene la nota a modificar
  }

  // Validador personalizado para verificar palabras prohibidas en los campos del formulario
  blacklistValidator(blacklist: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const hasBlacklistedWord = blacklist.some(word => control.value.toLowerCase().includes(word.toLowerCase()));
      return hasBlacklistedWord ? { 'blacklisted': true } : null;
    };
  }

  // Método para obtener todos los usuarios
  getAllUsers() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getAllUsers(token).subscribe({
        next: (data: any[]) => {
          this.usuarios = data;
        },
        error: (error) => {
          console.error('Error al obtener la lista de usuarios:', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  // Método para obtener la nota a modificar
  getNote(): void {
    const noteID = Number(this.route.snapshot.paramMap.get('id'));
    const token = localStorage.getItem('token');
    if (token) {
      this.noteService.getNota(noteID, token).subscribe({
        next: (data: any) => {
          this.notaForm.patchValue({
            id: data.id,
            titulo: data.titulo,
            contenido: data.contenido,
          });
          this.usuario.email = data.usuario.email;
        },
        error: (error: any) => {
          console.error('Error al cargar la nota', error);
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
    const token = localStorage.getItem('token');
    this.buscarIdUsuario();
    if (this.notaForm.valid && token) {
      const newNote = {
        id: this.route.snapshot.paramMap.get('id'),
        titulo: this.notaForm.value.titulo,
        contenido: this.notaForm.value.contenido,
        usuario: {
          id: this.usuario.id
        }
      }
      this.noteService.modNota(newNote, token).subscribe({
        next: () => {
          this.openModalCerrar();
        },
        error: (error: any) => {
          console.error('Error al guardar la nota', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token o el formulario no es válido');
    }
  }

  // Método para navegar de vuelta al dashboard de usuarios
  irAAdminDashUsuarios() {
    this.router.navigate(['/notas']);
  }

  // Método para buscar el ID del usuario basado en su correo electrónico
  buscarIdUsuario(): void {
    if (this.usuario.email) {
      const usuario = this.usuarios.find(u => u.email === this.usuario.email);
      if (usuario) {
        this.usuario.id = usuario.id;
      } 
    } 
  }

  isModalCerrar = false; // Estado del modal de confirmación

  // Método para abrir el modal de confirmación
  openModalCerrar() {
    this.isModalCerrar = true;
  }

  // Método para cerrar el modal de confirmación
  closeModalCerrar() {
    this.isModalCerrar = false;
  }
}
