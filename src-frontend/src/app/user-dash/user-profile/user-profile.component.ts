import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtService } from '../../services/jwt-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { UserServiceService } from '../../services/user-service.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, MatMenuModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  // Objeto para solicitar el correo electrónico del usuario
  emailRequest = {
    email: ''
  };

  // Variable para almacenar el token de autenticación
  token: string | null = null;

  // Objeto para almacenar los datos del usuario
  user = {
    id: '',
    nombre: '',
    apellidos: '',
    email: '',
    contrasena: '',
  };

  // Variable para almacenar el correo inicial del usuario
  emailInicial: string = '';
  // Variable para almacenar la contraseña
  contrasena: string = '';

  // Formulario para los datos del usuario
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jwtService: JwtService,
    private userService: UserServiceService,
  ) {
    // Inicialización del formulario del usuario con validaciones
    this.userForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      apellidos: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: [{ value: '', disabled: true }],
      contrasena: ['', [Validators.minLength(5), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/)]],
      confirmContrasena: ['']
    }, { validator: this.passwordMatchValidator });
  }

  // Validador para verificar que las contraseñas coincidan
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmContrasena')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    // Comprobar el estado de autenticación del usuario
    this.checkAuthStatus();
    // Obtener los datos del usuario
    this.getUser();
  }

  // Comprobar si hay un token de autenticación almacenado
  checkAuthStatus() {
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

  // Obtener los datos del usuario utilizando el servicio de usuario
  getUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserEmail(this.emailRequest, token).subscribe({
        next: (data: any) => {
          this.userForm.patchValue({
            id: data.id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            email: data.email
          });
          this.emailInicial = data.email;
        },
        error: (error) => {
          console.error('Error al cargar al usuario', error);
        },
        complete: () => {}
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Ocultar un elemento en la interfaz de usuario
  ocultarElemento(id: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.style.display = 'none';
    } else {
      console.error('Elemento no encontrado con ID:', id);
    }
  }

  // Modificar los datos del usuario
  modificarUsuario(): void {
    const token = localStorage.getItem('token');
    if (this.user.contrasena == '') {}
    if (token) {
      if (this.userForm.value.contrasena !== '') {
        // Si hay contraseña nueva, incluirla en la actualización
        const userSiP = {
          id: this.userForm.value.id,
          nombre: this.userForm.value.nombre,
          apellidos: this.userForm.value.apellidos,
          email: this.userForm.value.email,
          contrasena: this.userForm.value.contrasena
        }
        this.userService.modUser(userSiP, token).subscribe({
          next: () => {
            this.openModalCerrar();
          },
          error: (error) => {
            console.error('Error al guardar al usuario', error);
          },
          complete: () => {}
        });
      } else {
        // Si no hay contraseña nueva, no incluirla en la actualización
        const userNoP = {
          id: this.userForm.value.id,
          nombre: this.userForm.value.nombre,
          apellidos: this.userForm.value.apellidos,
          email: this.userForm.value.email
        }
        this.userService.modUser(userNoP, token).subscribe({
          next: () => {
            this.openModalCerrar();
          },
          error: (error) => {
            console.error('Error al guardar al usuario', error);
          },
          complete: () => {}
        });
      }
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Mostrar un elemento en la interfaz de usuario
  confirmarModUsuario() {
    const elemento = document.getElementById('id01');
    if (elemento) {
      elemento.style.display = 'block';
    }
  }

  isModalCerrar = false;

  // Abrir el modal de confirmación
  openModalCerrar() {
    this.isModalCerrar = true;
  }

  // Cerrar el modal de confirmación
  closeModalCerrar() {
    this.isModalCerrar = false;
  }
}
