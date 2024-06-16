// Importaciones necesarias de Angular y otros módulos
import { Component } from '@angular/core';
import { ProyectService } from '../../services/proyect.service';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Decorador @Component para definir metadatos del componente
@Component({
  selector: 'app-admin-dash-list-proyects', // Selector del componente
  standalone: true, // Indicador de que el componente es autónomo
  imports: [CommonModule, AdminSidebarComponent, RouterLink, RouterLinkActive], // Módulos y componentes importados
  templateUrl: './admin-dash-list-proyects.component.html', // Ruta al archivo de plantilla HTML
  styleUrl: './admin-dash-list-proyects.component.css' // Ruta al archivo de estilos CSS
})
export class AdminDashListProyectsComponent {
  proyectos: any[] = []; // Array para almacenar los proyectos
  proyectoBorradoID: any; // ID del proyecto a borrar
  proyectoBorradoTitulo: any; // Título del proyecto a borrar

  // Constructor para inyectar el servicio de proyectos
  constructor(private proyectService: ProyectService) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.getAllProyects(); // Obtener todos los proyectos
  }

  // Método para obtener todos los proyectos
  getAllProyects() {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.proyectService.getAllProyects(token).subscribe({
        next: (data: any[]) => {
          this.proyectos = data; // Asignar los datos obtenidos al array de proyectos
        },
        error: (error) => {
          console.error('Error al obtener la lista de proyectos:', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  // Método para confirmar el borrado de un proyecto
  confirmarborrarProyecto(id: number, titulo: any) {
    this.proyectoBorradoID = id; // Asignar el ID del proyecto a borrar
    this.proyectoBorradoTitulo = titulo; // Asignar el título del proyecto a borrar
    this.openModal(); // Abrir el modal de confirmación
  }

  // Método para borrar un proyecto
  borrarProyecto(id: number) {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.proyectService.borrarProyecto(id, token).subscribe({
        next: (response) => {
          this.getAllProyects(); // Actualizar la lista de proyectos después de borrar uno
        },
        error: (error) => {
          console.error('Error al borrar proyecto:', error); // Manejar errores
        },
        complete: () => {
        }
      });
    }
  }

  // Método para modificar un proyecto (no implementado completamente)
  modificarProyecto(id: number) {
    window.localStorage["idProyecto"] = id; // Guardar el ID del proyecto en el almacenamiento local
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
