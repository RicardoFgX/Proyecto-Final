import { Component } from '@angular/core';
import { ProyectService } from '../../services/proyect.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserSidebarComponent } from '../../components/user-sidebar/user-sidebar.component';
import { UserServiceService } from '../../services/user-service.service';
import { jwtDecode } from 'jwt-decode';
import { JwtService } from '../../services/jwt-service.service';

@Component({
  selector: 'app-user-proyects',
  standalone: true,
  imports: [CommonModule, UserSidebarComponent, RouterLink, RouterLinkActive],
  templateUrl: './user-proyects.component.html',
  styleUrl: './user-proyects.component.css'
})
export class UserProyectsComponent {
  proyectos: any[] = []; // Arreglo para almacenar los proyectos del usuario
  proyectoBorradoID: any; // ID del proyecto a borrar
  proyectoBorradoTitulo: any; // Título del proyecto a borrar

  userID: any = 1; // ID del usuario, inicializado en 1

  emailRequest = {
    email: ''
  };

  token: string | null = null; // Token de autenticación

  constructor(
    private proyectService: ProyectService,
    private userService: UserServiceService,
    private jwtService: JwtService
  ) { }

  ngOnInit(): void {
    // Al inicializar el componente, verificar el estado de autenticación y obtener el usuario
    this.checkAuthStatus();
    this.getUser();
  }

  getAllProyects() {
    // Obtener todos los proyectos del usuario
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserProyects(this.userID, token).subscribe({
        next: (data: any[]) => {
          this.proyectos = data;
        },
        error: (error) => {
          console.error('Error al obtener la lista de proyectos:', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  getUser(): void {
    // Obtener el usuario utilizando el token
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserEmail(this.emailRequest, token).subscribe({
        next: (data: any) => {
          this.userID = data.id;
          this.getAllProyects();
        },
        error: (error) => {
          console.error('Error al cargar al usuario', error);
        },
        complete: () => {
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
        this.emailRequest.email = decodedToken?.sub; // "sub" es el campo donde se almacena el correo electrónico en el token
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  confirmarborrarProyecto(id: number, titulo: any) {
    // Confirmar el borrado del proyecto
    this.proyectoBorradoID = id;
    this.proyectoBorradoTitulo = titulo;
    this.openModal();
  }

  borrarProyecto(id: number) {
    // Borrar un proyecto por su ID
    const token = localStorage.getItem('token');
    if (token) {
      this.proyectService.borrarProyecto(id, token).subscribe({
        next: (response) => {
          this.getAllProyects(); // Actualizar la lista de proyectos después de borrar uno
        },
        error: (error) => {
          console.error('Error al borrar el proyecto:', error);
        },
        complete: () => {
        }
      });
    }
  }

  modificarProyecto(id: number) {
    // Guardar el ID del proyecto a modificar en el almacenamiento local
    window.localStorage["idProyecto"] = id;
  }

  ocultarElemento(id: string) {
    // Ocultar un elemento por su ID
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.style.display = 'none';
    } else {
      console.error('Elemento no encontrado con ID:', id);
    }
  }

  isModalOpen = false; // Estado del modal de confirmación de borrado
  isModalCerrar = false; // Estado del modal de cierre

  openModal() {
    // Abrir el modal de confirmación de borrado
    this.isModalOpen = true;
  }

  closeModal() {
    // Cerrar el modal de confirmación de borrado
    this.isModalOpen = false;
  }

  confirmAction() {
    // Confirmar la acción y cerrar el modal
    this.closeModal();
  }

  openModalCerrar() {
    // Abrir el modal de cierre
    this.isModalCerrar = true;
  }

  closeModalCerrar() {
    // Cerrar el modal de cierre
    this.isModalCerrar = false;
  }

  truncateText(text: string, maxLength: number): string {
    // Truncar el texto si supera la longitud máxima
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    } else {
      return text;
    }
  }
}
