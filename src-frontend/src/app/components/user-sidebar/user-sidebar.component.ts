import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import { NoteService } from '../../services/note.service';
import { JwtService } from '../../services/jwt-service.service';
import { UserServiceService } from '../../services/user-service.service';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { ProyectService } from '../../services/proyect.service';


@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatExpansionModule, CommonModule],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.css'
})
export class UserSidebarComponent {
  panelOpenState = false;
  emailInicial: string = '';

  emailRequest = {
    email: ''
  };

  token: string | null = null;

  user = {
    id: '',
    nombre: '',
    apellidos: '',
    email: '',
    contrasena: '',
  };

  notes: any[] = [];
  proyectos: any[] = [];

  constructor(private router: Router, private noteService: NoteService, 
    private jwtService: JwtService, private userService: UserServiceService, 
    private authService: AuthService, private proyectService: ProyectService) { }

  ngOnInit(): void {
    this.checkAuthStatus();
    this.getUser();
  }

  getAllNotesUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.noteService.getAllNotesUser(Number(this.user.id), token).subscribe({
        next: (data: any[]) => {
          this.notes = data;
        },
        error: (error) => {
          if (error.status === 200) {
            console.error('No hay ninguna anotación para este usuario');
            // Aquí puedes agregar lógica específica para el error 404, como mostrar un mensaje al usuario
          } else {
            console.error('Error al obtener la lista de anotaciones:', error);
            // Puedes agregar lógica adicional para otros tipos de errores
          }
        },
        complete: () => {
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }
  

  getUser(): void {
    // Obtener el ID del usuario de la URL
    const token = localStorage.getItem('token');
    if (token) {
      // Utilizar el servicio de usuario para obtener los datos del usuario por su ID
      console.log(this.emailRequest)
      this.userService.getUserEmail(this.emailRequest, token).subscribe({
        next: (data: any) => {
          this.user.id = data.id;
          this.user.nombre = data.nombre;
          this.user.apellidos = data.apellidos;
          this.user.email = data.email;
          this.emailInicial = data.email;
          this.getAllNotesUser();
          this.getAllProyectoID();
        },
        error: (error) => {
          console.error('Error al cargar al usuario', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  checkAuthStatus() {
    // Verificar si hay un token guardado en el almacenamiento local
    this.token = this.jwtService.getToken();
    if (this.token != null) {
      try {
        // Decodificar el token para obtener el correo electrónico del usuario
        const decodedToken: any = jwtDecode(this.token);
        this.emailRequest.email = decodedToken?.sub; // "sub" es el campo donde se almacena el correo electrónico en el token
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  getAllProyectoID() {
    const token = localStorage.getItem('token');
    if (token) {
      this.proyectService.getAllProyectoID(Number(this.user.id), token).subscribe({
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
}
