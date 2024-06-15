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
  proyectos: any[] = [];
  proyectoBorradoID: any;
  proyectoBorradoTitulo: any;

  userID: any = 1;

  emailRequest = {
    email: ''
  };

  token: string | null = null;

  constructor(private proyectService: ProyectService,
    private userService: UserServiceService,
    private jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.checkAuthStatus();
    this.getUser();
  }

  getAllProyects() {
    const token = localStorage.getItem('token');
    console.log("TERCERO");
    if (token) {
      this.userService.getUserProyects(this.userID, token).subscribe({
        next: (data: any[]) => {
          this.proyectos = data;
        },
        error: (error) => {
          console.error('Error al obtener la lista de proyectos:', error);
        },
        complete: () => {
          console.log('Petición para obtener la lista de proyectos completada');
          console.log(this.proyectos);
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
          this.userID = data.id;
          console.log("Segundo")
          console.log(this.userID);
          this.getAllProyects();
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
        console.log("Primero");
        console.log(this.emailRequest)
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  confirmarborrarProyecto(id: number, titulo: any){
      this.proyectoBorradoID = id;
      this.proyectoBorradoTitulo = titulo;
      this.openModal();
  }

  borrarProyecto(id: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.proyectService.borrarProyecto(id, token).subscribe({
        next: (response) => {
          console.log('Usuario borrado exitosamente:', response);
          // Actualizar la lista de usuarios después de borrar uno
          this.getAllProyects();
        },
        error: (error) => {
          console.error('Error al borrar usuario:', error);
        },
        complete: () => {
          console.log('La petición para borrar usuario ha finalizado');
        }
      });
    }
  }

  modificarProyecto(id: number) {
    window.localStorage["idProyecto"] = id;
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
  isModalCerrar = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  confirmAction() {
    // Acción de confirmación (ej. eliminar un elemento)
    console.log('Elemento borrado');
    this.closeModal();
  }

  openModalCerrar() {
    this.isModalCerrar = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    } else {
      return text;
    }
  }
}
