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

  constructor(private noteService: NoteService, private userService: UserServiceService, private jwtService: JwtService) { }

  ngOnInit(): void {
    this.checkAuthStatus();
    this.getUser();
  }

  getAllNotesUser() {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("El usuario es este " + this.user.id);
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
          console.log('Petición para obtener la lista de anotaciones completada');
          console.log(this.notes);
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  getUser(): void {
    // Obtener el ID del usuario de la URL
    const token = localStorage.getItem('token');
    if (token) {
      // Utilizar el servicio de usuario para obtener los datos del usuario por su ID
      console.log(this.emailRequest)
      this.userService.getUserEmail(this.emailRequest, token).subscribe({
        next: (data: any) => {
          this.user.id = data.id;
          this.user.nombre = data.nombre;
          this.user.apellidos = data.apellidos;
          this.user.email = data.email;
          this.emailInicial = data.email;
          console.log(data);
          this.getAllNotesUser();
        },
        error: (error) => {
          console.error('Error al cargar al usuario', error);
        },
        complete: () => {
          console.log('Petición para obtener el usuario completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  checkAuthStatus() {
    // Verificar si hay un token guardado en el almacenamiento local
    this.token = this.jwtService.getToken();
    if (this.token != null) {
      try {
        // Decodificar el token para obtener el correo electrónico del usuario
        const decodedToken: any = jwtDecode(this.token);
        console.log(decodedToken?.sub);
        this.emailRequest.email = decodedToken?.sub; // "sub" es el campo donde se almacena el correo electrónico en el token
        console.log(this.emailRequest)
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  confirmarborrarNota(id: number, titulo: any){
      this.notaBorradoID = id;
      this.notaBorradoTitulo = titulo;
      this.openModal();
  }

  borrarNota(id: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.noteService.borrarNota(id, token).subscribe({
        next: (response) => {
          console.log('Anotación borrada exitosamente:', response);
          // Actualizar la lista de usuarios después de borrar uno
          this.getAllNotesUser();
        },
        error: (error) => {
          console.error('Error al borrar anotación:', error);
        },
        complete: () => {
          console.log('La petición para borrar la anotación ha finalizado');
        }
      });
    }
  }


  modificarNota(id: number) {
    window.localStorage["idNota"] = id;
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

  otraFuncion() {
    console.log("Segunda Función");
  }

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  confirmAction() {
    console.log('Elemento borrado');
    this.closeModal();
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    } else {
      return text;
    }
  }
}
