// Importaciones necesarias de Angular y otros módulos
import { Component } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Decorador @Component para definir metadatos del componente
@Component({
  selector: 'app-admin-dash-list-users', // Selector del componente
  standalone: true, // Indicador de que el componente es autónomo
  imports: [CommonModule, AdminSidebarComponent, RouterLink, RouterLinkActive], // Módulos y componentes importados
  templateUrl: './admin-dash-list-users.component.html', // Ruta al archivo de plantilla HTML
  styleUrl: './admin-dash-list-users.component.css' // Ruta al archivo de estilos CSS
})
export class AdminDashListUsersComponent {
  users: any[] = []; // Array para almacenar los usuarios
  usuarioBorradoID: any; // ID del usuario a borrar
  usuarioBorradoEmail: any; // Email del usuario a borrar

  // Constructor para inyectar el servicio de usuarios
  constructor(private userService: UserServiceService) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.getAllUsers(); // Obtener todos los usuarios
  }

  // Método para obtener todos los usuarios
  getAllUsers() {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.userService.getAllUsers(token).subscribe({
        next: (data: any[]) => {
          this.users = data; // Asignar los datos obtenidos al array de usuarios
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

  // Método para confirmar el borrado de un usuario
  confirmarborrarUsuario(id: number, email: any){
    this.usuarioBorradoID = id; // Asignar el ID del usuario a borrar
    this.usuarioBorradoEmail = email; // Asignar el email del usuario a borrar
    this.openModal(); // Abrir el modal de confirmación
  }

  // Método para borrar un usuario
  borrarUsuario(id: number) {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.userService.borrarUsuario(id, token).subscribe({
        next: () => {
          this.getAllUsers(); // Actualizar la lista de usuarios después de borrar uno
          this.openModalCerrar(); // Abrir el modal de acción satisfactoria
        },
        error: (error) => {
          console.error('Error al borrar usuario:', error); // Manejar errores
        },
        complete: () => {
        }
      });
    }
  }

  // Método para modificar un usuario (no implementado completamente)
  modificarUsuario(id: number) {
    window.localStorage["idUsuario"] = id; // Guardar el ID del usuario en el almacenamiento local
  }

  // Método para ocultar un elemento del DOM
  ocultarElemento(id: string) {
    const elemento = document.getElementById(id); // Obtener el elemento por ID
    if (elemento) {
      elemento.style.display = 'none'; // Ocultar el elemento
    }
  }

  // Variables para controlar la visibilidad de los modales
  isModalOpen = false;
  isModalCerrar = false;

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

  // Método para abrir el modal de acción satisfactoria
  openModalCerrar() {
    this.isModalCerrar = true;
  }

  // Método para cerrar el modal de acción satisfactoria
  closeModalCerrar() {
    this.isModalCerrar = false;
  }

  // Método para truncar texto a una longitud máxima
  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...'; // Truncar texto y añadir puntos suspensivos
    } else {
      return text; // Devolver el texto original si es menor que la longitud máxima
    }
  }
}
