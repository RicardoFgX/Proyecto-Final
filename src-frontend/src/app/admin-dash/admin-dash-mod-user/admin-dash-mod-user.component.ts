import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dash-mod-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dash-mod-user.component.html',
  styleUrl: './admin-dash-mod-user.component.css'
})
export class AdminDashModUserComponent {
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

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    // Obtener el ID del usuario de la URL
    const userID = Number(this.route.snapshot.paramMap.get('id'));
    console.log(userID);
    const token = localStorage.getItem('token');
    if (token) {
      // Utilizar el servicio de usuario para obtener los datos del usuario por su ID
      this.userService.getUser(userID, token).subscribe({
        next: (data: any) => {
          this.user.id = data.id;
          this.user.nombre = data.nombre;
          this.user.apellidos = data.apellidos;
          this.user.email = data.email;
          console.log(data);
        },
        error: (error) => {
          console.error('Error al cargar al usuario', error);
        },
        complete: () => {
          console.log('Petición para obtener el usuario completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  modificarUsuario(): void {
    const token = localStorage.getItem('token');
    console.log(this.user.contrasena);
    if(this.user.contrasena == ''){
      console.log("vacio");
    }
    if (token) {
      if (this.user.contrasena !== '') {
        console.log("NuevaContra");
        this.userService.modUser(this.user, token).subscribe({
          next: () => {
          },
          error: (error) => {
            console.error('Error al guardar al usuario', error);
          },
          complete: () => {
            console.log('Petición para modificar el usuario completada');
          }
        });
      } else {
        console.log("sin contra");
        const userNoP = {
          id: this.user.id,
          nombre: this.user.nombre,
          apellidos: this.user.apellidos,
          email: this.user.email
        }
        this.userService.modUser(userNoP, token).subscribe({
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
    this.confirmarModUsuario();
  }

  irAAdminDashUsuarios() {
    this.router.navigate(['/adminDash/usuarios']);
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

  confirmarModUsuario(){
    const elemento = document.getElementById('id01');
    if (elemento) {
      elemento.style.display = 'block';
    }
  }
}