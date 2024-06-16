// Importaciones necesarias de Angular y otros módulos
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { NoteService } from '../../services/note.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Decorador @Component para definir metadatos del componente
@Component({
  selector: 'app-admin-dash-list-notes', // Selector del componente
  standalone: true, // Indicador de que el componente es autónomo
  imports: [CommonModule, AdminSidebarComponent, RouterLink, RouterLinkActive], // Módulos y componentes importados
  templateUrl: './admin-dash-list-notes.component.html', // Ruta al archivo de plantilla HTML
  styleUrl: './admin-dash-list-notes.component.css' // Ruta al archivo de estilos CSS
})
export class AdminDashListNotesComponent {
  notes: any[] = []; // Array para almacenar las notas
  notaBorradoID: any; // ID de la nota a borrar
  notaBorradoTitulo: any; // Título de la nota a borrar

  // Constructor para inyectar el servicio de notas
  constructor(private noteService: NoteService) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.getAllNotes(); // Obtener todas las notas
  }

  // Método para obtener todas las notas
  getAllNotes() {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.noteService.getAllNotes(token).subscribe({
        next: (data: any[]) => {
          this.notes = data; // Asignar los datos obtenidos al array de notas
        },
        error: (error) => {
          console.error('Error al obtener la lista de anotaciones:', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  // Método para confirmar el borrado de una nota
  confirmarborrarNota(id: number, titulo: any) {
    this.notaBorradoID = id; // Asignar el ID de la nota a borrar
    this.notaBorradoTitulo = titulo; // Asignar el título de la nota a borrar
    this.openModal(); // Abrir el modal de confirmación
  }

  // Método para borrar una nota
  borrarNota(id: number) {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.noteService.borrarNota(id, token).subscribe({
        next: (response) => {
          this.getAllNotes(); // Actualizar la lista de notas después de borrar una
        },
        error: (error) => {
          console.error('Error al borrar anotación:', error); // Manejar errores
        },
        complete: () => {
        }
      });
    }
  }

  // Método para modificar una nota (no implementado completamente)
  modificarNota(id: number) {
    window.localStorage["idNota"] = id; // Guardar el ID de la nota en el almacenamiento local
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
