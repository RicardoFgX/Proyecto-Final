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

  emailInicial: string = '';
  contrasena: string = '';

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jwtService: JwtService,
    private userService: UserServiceService,
  ) {
    this.userForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      apellidos: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: [{ value: '', disabled: true }],
      contrasena: ['', [Validators.minLength(5), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/)]],
      confirmContrasena: ['']
    }, { validator: this.passwordMatchValidator });
  }
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmContrasena')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    this.checkAuthStatus();
    this.getUser();
  }

  checkAuthStatus() {
    // Verificar si hay un token guardado en el almacenamiento local
    this.token = this.jwtService.getToken();
    if (this.token != null) {
      try {
        // Decodificar el token para obtener el correo electrónico del usuario
        const decodedToken: any = jwtDecode(this.token);
        console.log(decodedToken);
        this.emailRequest.email = decodedToken?.sub; // "sub" es el campo donde se almacena el correo electrónico en el token
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  getUser(): void {
    // Obtener el ID del usuario de la URL
    const token = localStorage.getItem('token');
    if (token) {
      // Utilizar el servicio de usuario para obtener los datos del usuario por su ID
      this.userService.getUserEmail(this.emailRequest, token).subscribe({
        next: (data: any) => {
          this.userForm.patchValue({
            id: data.id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            email: data.email
          });
          this.emailInicial = data.email;
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

  ocultarElemento(id: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      console.log("Id de ejemplo", id);
      elemento.style.display = 'none';
    } else {
      console.error('Elemento no encontrado con ID:', id);
    }
  }

  prueba(): void{
    console.log(this.userForm)
  }

  modificarUsuario(): void {
    const token = localStorage.getItem('token');
    console.log(this.user.contrasena);
    if (this.user.contrasena == '') {
      console.log("vacio");
    }
    if (token) {
      if (this.userForm.value.contrasena !== '') {
        console.log("NuevaContra");
        const userSiP = {
          id: this.userForm.value.id,
          nombre: this.userForm.value.nombre,
          apellidos: this.userForm.value.apellidos,
          email: this.userForm.value.email,
          contrasena: this.userForm.value.contrasena
        }
        console.log(userSiP);
        this.userService.modUser(userSiP, token).subscribe({
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
        console.log("sin contra");
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
          complete: () => {
            console.log('Petición para modificar el usuario completada');
          }
        });
      }
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  confirmarModUsuario() {
    const elemento = document.getElementById('id01');
    if (elemento) {
      elemento.style.display = 'block';
    }
  }

  isModalCerrar = false;

  openModalCerrar() {
    this.isModalCerrar = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
  }

}
