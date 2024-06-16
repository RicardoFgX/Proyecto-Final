import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoteService } from '../../services/note.service';
import { JwtService } from '../../services/jwt-service.service';
import { UserServiceService } from '../../services/user-service.service';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { ProyectService } from '../../services/proyect.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatExpansionModule, CommonModule, MatIconModule],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.css'
})
export class UserSidebarComponent implements OnInit {
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

  isCollapsed = false;

  // Función para alternar la visibilidad de la barra lateral
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  // Constructor con inyección de dependencias
  constructor(
    private router: Router,
    private noteService: NoteService, 
    private jwtService: JwtService, 
    private userService: UserServiceService, 
    private authService: AuthService, 
    private proyectService: ProyectService
  ) { }

  // Función de inicialización
  ngOnInit(): void {
    this.checkAuthStatus();
    this.getUser();
  }

  // Obtener todas las notas del usuario
  getAllNotesUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.noteService.getAllNotesUser(Number(this.user.id), token).subscribe({
        next: (data: any[]) => {
          this.notes = data;
        },
        error: (error) => {
          console.error('Error al obtener las notas del usuario:', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  // Obtener datos del usuario
  getUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
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
          console.error('Error al cargar al usuario:', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Verificar el estado de autenticación
  checkAuthStatus() {
    this.token = this.jwtService.getToken();
    if (this.token != null) {
      try {
        const decodedToken: any = jwtDecode(this.token);
        this.emailRequest.email = decodedToken?.sub; // "sub" es el campo donde se almacena el correo electrónico en el token
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  // Obtener todos los proyectos del usuario
  getAllProyectoID() {
    const token = localStorage.getItem('token');
    if (token) {
      this.proyectService.getAllProyectoID(Number(this.user.id), token).subscribe({
        next: (data: any[]) => {
          this.proyectos = data;
        },
        error: (error) => {
          console.error('Este usuario no tiene ningun proyecto que cargar proyectos:', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }
}
