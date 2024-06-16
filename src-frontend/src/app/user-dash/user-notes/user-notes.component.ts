import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { UserSidebarComponent } from '../../components/user-sidebar/user-sidebar.component';
import { UserServiceService } from '../../services/user-service.service';
import { JwtService } from '../../services/jwt-service.service';
import { jwtDecode } from 'jwt-decode';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-user-notes',
  standalone: true,
  imports: [CommonModule, UserSidebarComponent, RouterLink, RouterLinkActive, AdminSidebarComponent],
  templateUrl: './user-notes.component.html',
  styleUrl: './user-notes.component.css'
})
export class UserNotesComponent {
  notes: any[] = [];
  notaBorradoID: any;
  notaBorradoTitulo: any;

  panelOpenState = false;
  emailInicial: string = '';

  emailRequest = {
    email: ''
  };

  token: string | null = null;

  user = {
    id: '',
    nombre: '',
    apellidos: '',
    email: '',
    contrasena: '',
  };

  constructor(
    private noteService: NoteService, 
    private userService: UserServiceService, 
    private jwtService: JwtService
  ) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.checkAuthStatus();
    this.getUser();
  }

  // Método para obtener todas las notas del usuario
  getAllNotesUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.noteService.getAllNotesUser(Number(this.user.id), token).subscribe({
        next: (data: any[]) => {
          this.notes = data;
        },
        error: (error) => {
          if (error.status === 200) {
            console.error('No hay ninguna anotación para este usuario');
            // Aquí puedes agregar lógica específica para el error 404, como mostrar un mensaje al usuario
          } else {
            console.error('Error al obtener la lista de anotaciones:', error);
            // Puedes agregar lógica adicional para otros tipos de errores
          }
        },
        complete: () => {
          // Lógica adicional al completar la petición
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  // Método para obtener los datos del usuario autenticado
  getUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserEmail(this.emailRequest, token).subscribe({
        next: (data: any) => {
          this.user.id = data.id;
          this.user.nombre = data.nombre;
          this.user.apellidos = data.apellidos;
          this.user.email = data.email;
          this.emailInicial = data.email;
          this.getAllNotesUser();
        },
        error: (error) => {
          console.error('Error al cargar al usuario', error);
        },
        complete: () => {
          // Lógica adicional al completar la petición
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Método para verificar el estado de autenticación del usuario
  checkAuthStatus() {
    this.token = this.jwtService.getToken();
    if (this.token != null) {
      try {
        const decodedToken: any = jwtDecode(this.token);
        this.emailRequest.email = decodedToken?.sub; // "sub" es el campo donde se almacena el correo electrónico en el token
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  // Método para abrir el modal de confirmación de borrado
  confirmarborrarNota(id: number, titulo: any) {
    this.notaBorradoID = id;
    this.notaBorradoTitulo = titulo;
    this.openModal();
  }

  // Método para borrar una nota
  borrarNota(id: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.noteService.borrarNota(id, token).subscribe({
        next: (response) => {
          // Actualizar la lista de notas después de borrar una
          this.getAllNotesUser();
        },
        error: (error) => {
          console.error('Error al borrar anotación:', error);
        },
        complete: () => {
          // Lógica adicional al completar la petición
        }
      });
    }
  }

  // Método para modificar una nota (almacena el ID de la nota en el almacenamiento local)
  modificarNota(id: number) {
    window.localStorage["idNota"] = id;
  }

  // Método para ocultar un elemento del DOM por su ID
  ocultarElemento(id: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.style.display = 'none';
    } else {
      console.error('Elemento no encontrado con ID:', id);
    }
  }

  // Estado del modal de confirmación de borrado
  isModalOpen = false;

  // Método para abrir el modal de confirmación de borrado
  openModal() {
    this.isModalOpen = true;
  }

  // Método para cerrar el modal de confirmación de borrado
  closeModal() {
    this.isModalOpen = false;
  }

  // Método para confirmar la acción de borrado
  confirmAction() {
    this.closeModal();
  }

  // Método para truncar el texto si excede una longitud máxima
  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    } else {
      return text;
    }
  }
}
