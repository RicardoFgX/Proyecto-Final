import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-dash-new-tarea',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatInputModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-dash-new-tarea.component.html',
  styleUrl: './admin-dash-new-tarea.component.css'
})
export class AdminDashNewTareaComponent {
  tarea = {
    nombre: '',
    descripcion: '',
    fechaVencimiento: '',
    estado: '',
    proyecto: {
      id: ''
    }
  }

  estados = ['COMPLETADA', 'EN_PROGRESO', 'PENDIENTE'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tareaService: TareaService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.tarea.proyecto.id = window.localStorage["idProyecto"];
  }

  irAtras(): void {
    this.location.back();
  }

  crearTarea(): void {
    console.log(this.tarea);
    const token = localStorage.getItem('token');
    if (token) {
      const newTarea = {
        nombre: this.tarea.nombre,
        descripcion: this.tarea.descripcion,
        fechaVencimiento: this.tarea.fechaVencimiento,
        estado: this.tarea.estado,
        proyecto: {
          id: this.tarea.proyecto.id
        }
      }
      this.tareaService.createTarea(newTarea, token).subscribe({
        next: () => {
        },
        error: (error: any) => {
          console.error('Error al crear la tarea', error);
        },
        complete: () => {
          console.log('Petición para crear la tarea completada');
          this.confirmarModTarea();
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  confirmarModTarea() {
    const elemento = document.getElementById('id01');
    if (elemento) {
      elemento.style.display = 'block';
    }
  }
}
