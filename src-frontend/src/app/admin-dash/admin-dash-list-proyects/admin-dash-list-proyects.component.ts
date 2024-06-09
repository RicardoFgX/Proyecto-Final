import { Component } from '@angular/core';
import { ProyectService } from '../../services/proyect.service';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-dash-list-proyects',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent, RouterLink, RouterLinkActive],
  templateUrl: './admin-dash-list-proyects.component.html',
  styleUrl: './admin-dash-list-proyects.component.css'
})
export class AdminDashListProyectsComponent {
  proyectos: any[] = [];
  proyectoBorradoID: any;
  proyectoBorradoTitulo: any;

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
}
