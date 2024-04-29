import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dash.component.html',
  styleUrl: './admin-dash.component.css'
})
export class AdminDashComponent {
  users: any[] = [];

  constructor(private userService: UserServiceService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getAllUsers(token).subscribe({
        next: (data: any[]) => {
          this.users = data;
        },
        error: (error) => {
          console.error('Error al obtener la lista de usuarios:', error);
        },
        complete: () => {
          console.log('Petición para obtener la lista de usuarios completada');
          console.log(this.users);
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  borrarUsuario(id: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.borrarUsuario(id, token).subscribe({
        next: (response) => {
          console.log('Usuario borrado exitosamente:', response);
          // Actualizar la lista de usuarios después de borrar uno
          this.getAllUsers();
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


  modificarUsuario(id: number) {

  }
}
