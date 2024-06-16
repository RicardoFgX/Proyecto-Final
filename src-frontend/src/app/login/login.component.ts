import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../services/jwt-service.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  token: string = '';
  loginError: boolean = false; // Variable para manejar el error de autenticación
  registerError: boolean = false; // Variable para manejar el error de registro

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router
  ) {
    // Inicialización del formulario de inicio de sesión
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Inicialización del formulario de registro
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^(?=.*\d)[A-Za-z\d]{5,}$/)]]
    });
  }

  // Método para manejar el inicio de sesión
  onLogin(): void {
    this.loginError = false; // Resetear el error antes de intentar el login
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email,
        contrasena: this.loginForm.value.password
      };

      // Llamar al servicio de autenticación para el login
      this.authService.login(credentials).subscribe({
        next: (resp) => {
          this.token = resp.user.token;

          // Guardar el token en el servicio de JWT
          this.jwtService.saveToken(resp.user.token);
          this.redirectUserByRole(); // Redirigir al usuario según su rol
        },
        error: (error) => {
          this.loginError = true; // Establecer el error si las credenciales son incorrectas
        },
        complete: () => {
        }
      });
    }
  }

  // Método para manejar el registro de nuevos usuarios
  onRegister(): void {
    this.registerError = false; // Resetear el error antes de intentar el registro
    if (this.registerForm.valid) {
      const credentials = {
        nombre: this.registerForm.value.nombre,
        email: this.registerForm.value.email,
        contrasena: this.registerForm.value.password
      };

      // Llamar al servicio de autenticación para el registro
      this.authService.register(credentials).subscribe({
        next: (resp) => {
          this.token = resp.user.token;

          // Guardar el token en el servicio de JWT
          this.jwtService.saveToken(resp.user.token);
          this.redirectUserByRole(); // Redirigir al usuario según su rol
        },
        error: (error) => {
          this.registerError = true; // Establecer el error si el correo ya está registrado
        },
        complete: () => {
        }
      });
    }
  }

  // Método para redirigir al usuario según su rol
  redirectUserByRole() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decodificar el token
        if (decodedToken && decodedToken.role && decodedToken.role.length > 0) {
          const userRole = decodedToken.role[0].authority;
          if (userRole === 'ADMINISTRADOR') {
            window.location.href = '/adminDash'; // Redirigir a la vista de administrador
          } else {
            window.location.href = '/userHome'; // Redirigir a la vista de usuario
          }
        } else {
          console.error('El token no contiene información de rol.');
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }
}
