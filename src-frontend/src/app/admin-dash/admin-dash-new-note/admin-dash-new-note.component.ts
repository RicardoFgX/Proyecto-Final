import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-admin-dash-new-note',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dash-new-note.component.html',
  styleUrl: './admin-dash-new-note.component.css'
})
export class AdminDashNewNoteComponent {
  nota = {
    id: '',
    titulo: '',
    contenido: '',
    usuario: {
      id: ''
    }
  };

  usuario = {
    email: '',
    id: '',
  };

  usuarios: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private noteService: NoteService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

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
          console.log('Petición para obtener la lista de usuarios completada');
          console.log(this.usuarios);
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  crearNota(): void {
    const token = localStorage.getItem('token');
    this.buscarIdUsuario();
    if (token) {
        const newNote = {
          id: this.nota.id,
          titulo: this.nota.titulo,
          contenido: this.nota.contenido,
          usuario: {
            id: this.usuario.id
          }
        }
        this.noteService.createNota(newNote, token).subscribe({
          next: () => {
          },
          error: (error: any) => {
            console.error('Error al guardar al usuario', error);
          },
          complete: () => {
            console.log('Petición para modificar el usuario completada'); 
          }
        });
      } else {
      console.error('Algo ocurrió con el token');
    }
    this.confirmarModNota();
  }
  
  irAAdminDashUsuarios() {
    this.router.navigate(['/adminDash/notas']);
  }

  ocultarElemento(id: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      console.log("Id de ejemplo", id);
      elemento.style.display = 'none';
    } else {
      console.error('Elemento no encontrado con ID:', id);
    }
  }

  confirmarModNota(){
    console.log("hola?")
    const elemento = document.getElementById('id01');
    if (elemento) {
      elemento.style.display = 'block';
    }
  }

  mostrarIdUsuario(email: string): void {
    const usuarioSeleccionado = this.usuarios.find(usuario => usuario.email === email);
    if (usuarioSeleccionado) {
      console.log('ID del usuario seleccionado:', usuarioSeleccionado.id);
    }
  }

  buscarIdUsuario(): void {
    if (this.usuario.email) {
      const usuario = this.usuarios.find(u => u.email === this.usuario.email);
      if (usuario) {
        console.log('ID del usuario:', usuario.id);
        this.usuario.id = usuario.id
      } else {
        console.log('Usuario no encontrado');
      }
    } else {
      console.log('No se ha seleccionado ningún correo electrónico');
    }
  }
}
