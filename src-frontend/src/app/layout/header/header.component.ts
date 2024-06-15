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
export class HeaderComponent implements OnInit{
  isAuthenticated: boolean = false;
  admin: boolean = false;
  userEmail: string | null = null;
  token: string | null = null;

  expectedRole = 'ADMINISTRADOR'; // Define el rol esperado


  constructor(private jwtService: JwtService, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    // Verificar si hay un token guardado en el almacenamiento local
    this.token = this.jwtService.getToken();
    if (this.token != null) {
      try {
        // Decodificar el token para obtener el correo electrónico del usuario
        const decodedToken: any = jwtDecode(this.token);
        console.log(decodedToken);
        this.userEmail = decodedToken?.sub; // "sub" es el campo donde se almacena el correo electrónico en el token
        this.isAuthenticated = true;
        if(decodedToken.role[0].authority === this.expectedRole){
          this.admin = true;
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  logout() {
    // Eliminar el token y el correo electrónico del usuario del almacenamiento local
    localStorage.removeItem('token');
    // Limpiar el estado de autenticación y el correo electrónico del usuario
    this.isAuthenticated = false;
    this.userEmail = null;
    window.location.href = '/home';
  }

  closeMenu() {
    const navbar = this.el.nativeElement.querySelector('#navbarSupportedContent');
    if (navbar.classList.contains('show')) {
      const button = this.el.nativeElement.querySelector('.navbar-toggler');
      button.click();
    }
  }
}
