import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtService } from '../../services/jwt-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isAuthenticated: boolean = false;
  userEmail: string | null = null;
  token: string | null = null;


  constructor(private jwtService: JwtService) { }

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
        this.userEmail = decodedToken?.sub; // "sub" es el campo donde se almacena el correo electrónico en el token
        this.isAuthenticated = true;
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
  }
}
