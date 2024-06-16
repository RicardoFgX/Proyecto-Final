import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtService } from '../../services/jwt-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false; // Estado de autenticación del usuario
  admin: boolean = false; // Estado que indica si el usuario es administrador
  userEmail: string | null = null; // Correo electrónico del usuario autenticado
  token: string | null = null; // Token de autenticación del usuario

  expectedRole = 'ADMINISTRADOR'; // Define el rol esperado para un administrador

  constructor(private jwtService: JwtService, private renderer: Renderer2, private el: ElementRef) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.checkAuthStatus(); // Verificar el estado de autenticación al iniciar el componente
  }

  // Método para verificar el estado de autenticación del usuario
  checkAuthStatus() {
    // Obtener el token del almacenamiento local
    this.token = this.jwtService.getToken();
    if (this.token != null) {
      try {
        // Decodificar el token para obtener la información del usuario
        const decodedToken: any = jwtDecode(this.token);
        this.userEmail = decodedToken?.sub; // Obtener el correo electrónico del token
        this.isAuthenticated = true; // Establecer el estado de autenticación a verdadero
        // Verificar si el rol del usuario coincide con el rol esperado de administrador
        if (decodedToken.role[0].authority === this.expectedRole) {
          this.admin = true; // Establecer el estado de administrador a verdadero
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error); // Manejar errores de decodificación
      }
    }
  }

  // Método para cerrar sesión
  logout() {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem('token');
    // Limpiar el estado de autenticación y el correo electrónico del usuario
    this.isAuthenticated = false;
    this.userEmail = null;
    // Redirigir al usuario a la página de inicio
    window.location.href = '/home';
  }

  // Método para cerrar el menú de navegación en pantallas pequeñas
  closeMenu() {
    const navbar = this.el.nativeElement.querySelector('#navbarSupportedContent');
    // Verificar si el menú está abierto
    if (navbar.classList.contains('show')) {
      const button = this.el.nativeElement.querySelector('.navbar-toggler');
      // Hacer clic en el botón de colapso para cerrar el menú
      button.click();
    }
  }
}
