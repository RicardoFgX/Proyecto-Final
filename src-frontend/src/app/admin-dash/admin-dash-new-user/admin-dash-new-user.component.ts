import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dash-new-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dash-new-user.component.html',
  styleUrl: './admin-dash-new-user.component.css'
})
export class AdminDashNewUserComponent {
  user = {
    id: '',
    nombre: '',
    apellidos: '',
    email: '',
    contrasena: '',
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserServiceService,
    private router: Router
  ) { }

  modificarUsuario(): void {
    const token = localStorage.getItem('token');
    if (token) {
      if (this.user.contrasena !== null) {
        this.userService.createUser(this.user, token).subscribe({
          next: () => {
            this.openModalCerrar();
          },
          error: (error) => {
            console.error('Error al guardar al usuario', error);
          },
          complete: () => {
            console.log('Petición para modificar el usuario completada');
          }
        });
      } else {
        const userNoP = {
          id: this.user.id,
          nombre: this.user.nombre,
          apellidos: this.user.apellidos,
          email: this.user.email
        }
        this.userService.createUser(userNoP, token).subscribe({
          next: () => {
          },
          error: (error) => {
            console.error('Error al guardar al usuario', error);
          },
          complete: () => {
            console.log('Petición para modificar el usuario completada'); 
          }
        });
      }
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  irAAdminDashUsuarios() {
    this.router.navigate(['/adminDash/usuarios']);
  }

  isModalOpen = false;
  isModalCerrar = false;

  openModalCerrar() {
    this.isModalCerrar = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
  }
}
