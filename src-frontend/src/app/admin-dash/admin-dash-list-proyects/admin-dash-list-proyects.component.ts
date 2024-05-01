import { Component } from '@angular/core';
import { ProyectService } from '../../services/proyect.service';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-dash-list-proyects',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-dash-list-proyects.component.html',
  styleUrl: './admin-dash-list-proyects.component.css'
})
export class AdminDashListProyectsComponent {
  proyectos: any[] = [];

  constructor(private proyectService: ProyectService) { }

  ngOnInit(): void {
    this.getAllProyects();
  }

  getAllProyects() {
    const token = localStorage.getItem('token');
    if (token) {
      this.proyectService.getAllProyects(token).subscribe({
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

  }
}
