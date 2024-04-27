import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../services/jwt-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  nombre: string = '';
  token: string = '';

  constructor(private authService: AuthService, private jwtService: JwtService) { }

  login() {
    console.log(this.email);
    console.log(this.password);

    const credentials = {
      email: this.email,
      contrasena: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (resp) => {
        // Pilla el token
        console.log(resp);
        console.log(resp.user.token);
        this.token = resp.user.token;

        // Lo guardo en local
        this.jwtService.saveToken(resp.user.token);
        window.location.href = '/home';
      },
      error: (error) => {
        console.error('Error de autenticación:', error);
      },
      complete: () => {
        /*const tokenSuelto = jwtDecode(this.token);
        console.log(tokenSuelto);*/
        console.log('He terminado la petición')
      }
    });
  }

  register() {
    console.log(this.nombre);
    console.log(this.email);
    console.log(this.password);

    const credentials = {
      nombre: this.nombre,
      email: this.email,
      contrasena: this.password
    };

    this.authService.register(credentials).subscribe({
      next: (resp) => {
        // Pilla el token
        console.log(resp);
        console.log(resp.user.token);
        this.token = resp.user.token;

        // Lo guardo en local
        this.jwtService.saveToken(resp.user.token);
        window.location.href = '/home';
      },
      error: (error) => {
        console.error('Error de autenticación:', error);
      },
      complete: () => {
        /*const tokenSuelto = jwtDecode(this.token);
        console.log(tokenSuelto);*/
        console.log('He terminado la petición')
      }
    });
  }
}
/*
  pruebaToken(): void {
    this.authService.loginToken();
  }

  loginToken(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No hay token almacenado.');
      return;
    }

    const cabecera = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.get('/api/ejemplo/u8t3', { headers: cabecera })
      .subscribe({
        next: (resp) => {
          console.log('Solicitud exitosa:', resp);
        },
        error: (error) => {
          console.error('Error en la solicitud (Esto probablemente es porque voy a una pagina que no existe):', error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="#">Why do I have this issue?</a>'
          });
        },
        complete: () => {
          console.log('He terminado la peticion para logueo con token1')
        }
      });
  }
*/
