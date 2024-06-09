import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { NoteService } from '../../services/note.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-dash-list-notes',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent, RouterLink, RouterLinkActive],
  templateUrl: './admin-dash-list-notes.component.html',
  styleUrl: './admin-dash-list-notes.component.css'
})
export class AdminDashListNotesComponent {
  notes: any[] = [];
  notaBorradoID: any;
  notaBorradoTitulo: any;

  constructor(private noteService: NoteService) { }

  ngOnInit(): void {
    this.getAllNotes();
  }

  getAllNotes() {
    const token = localStorage.getItem('token');
    if (token) {
      this.noteService.getAllNotes(token).subscribe({
        next: (data: any[]) => {
          this.notes = data;
        },
        error: (error) => {
          console.error('Error al obtener la lista de anotaciones:', error);
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

  confirmarborrarNota(id: number, titulo: any) {
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
          this.getAllNotes();
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
}
