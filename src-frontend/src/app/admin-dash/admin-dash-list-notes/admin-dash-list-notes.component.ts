import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-admin-dash-list-notes',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-dash-list-notes.component.html',
  styleUrl: './admin-dash-list-notes.component.css'
})
export class AdminDashListNotesComponent {
  notes: any[] = [];

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

  }
}
