import { Component } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';


@Component({
  selector: 'app-admin-dash-list-users',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-dash-list-users.component.html',
  styleUrl: './admin-dash-list-users.component.css'
})
export class AdminDashListUsersComponent {
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

  confirmarborrarUsuario(id: number){

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
