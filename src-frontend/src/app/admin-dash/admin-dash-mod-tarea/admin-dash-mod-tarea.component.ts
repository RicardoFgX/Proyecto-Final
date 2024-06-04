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
  selector: 'app-admin-dash-mod-tarea',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatInputModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-dash-mod-tarea.component.html',
  styleUrl: './admin-dash-mod-tarea.component.css'
})
export class AdminDashModTareaComponent {

  tarea = {
    id: '',
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
    this.getTarea();
    this.tarea.proyecto.id = window.localStorage.getItem('idProyecto') || '';
  }

  getTarea(): void {
    // Obtener el ID del usuario de la URL
    const tareaID = Number(this.route.snapshot.paramMap.get('id'));
    console.log(tareaID);
    const token = localStorage.getItem('token');
    if (token) {
      // Utilizar el servicio de usuario para obtener los datos del usuario por su ID
      this.tareaService.getTarea(tareaID, token).subscribe({
        next: (data: any) => {
          this.tarea.id = data.id;
          this.tarea.nombre = data.nombre;
          this.tarea.descripcion = data.descripcion;
          this.tarea.fechaVencimiento = data.fechaVencimiento;
          this.tarea.estado = data.estado;
          this.tarea.proyecto.id = window.localStorage["idProyecto"];
          console.log(data);
          console.log(this.tarea);
        },
        error: (error: any) => {
          console.error('Error al cargar la tarea', error);
        },
        complete: () => {
          console.log('Petición para obtener la tarea completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  irAtras(): void {
    this.location.back();
  }

  modificarTarea(): void {
    console.log(this.tarea);
    const token = localStorage.getItem('token');
    if (token) {
      const newTarea = {
        id: this.tarea.id,
        nombre: this.tarea.nombre,
        descripcion: this.tarea.descripcion,
        fechaVencimiento: this.tarea.fechaVencimiento,
        estado: this.tarea.estado,
        proyecto: {
          id: this.tarea.proyecto.id
        }
      }
      this.tareaService.modTarea(newTarea, token).subscribe({
        next: () => {
        },
        error: (error: any) => {
          console.error('Error al guardar la tarea', error);
        },
        complete: () => {
          console.log('Petición para modificar la tarea completada');
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
