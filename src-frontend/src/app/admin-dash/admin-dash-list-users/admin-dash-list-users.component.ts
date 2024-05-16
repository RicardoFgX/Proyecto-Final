import { Component } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-admin-dash-list-users',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent, RouterLink, RouterLinkActive],
  templateUrl: './admin-dash-list-users.component.html',
  styleUrl: './admin-dash-list-users.component.css'
})
export class AdminDashListUsersComponent {
  users: any[] = [];
  usuarioBorradoID: any;
  usuarioBorradoEmail: any;

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

  confirmarborrarUsuario(id: number, email: any){
    const elemento = document.getElementById('id01');
    if (elemento) {
      elemento.style.display = 'block';
      this.usuarioBorradoID = id;
      this.usuarioBorradoEmail = email;
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
    window.localStorage["idUsuario"] = id;
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
}
