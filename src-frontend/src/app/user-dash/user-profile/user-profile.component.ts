import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtService } from '../../services/jwt-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { UserServiceService } from '../../services/user-service.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, MatMenuModule, MatButtonModule, FormsModule],
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

  constructor(private jwtService: JwtService, private route: ActivatedRoute,
    private userService: UserServiceService, private authService: AuthService,
    private router: Router) { }

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
          this.user.id = data.id;
          this.user.nombre = data.nombre;
          this.user.apellidos = data.apellidos;
          this.user.email = data.email;
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

  modificarUsuario(): void {
    const token = localStorage.getItem('token');
    console.log(this.user.contrasena);
    if (this.user.contrasena == '') {
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
    console.log(this.user.email);
    console.log(this.emailInicial);
    if (this.user.email !== this.emailInicial) {
      console.log("nuevo correo");
      if(this.user.contrasena == ''){
        this.contrasena = window.localStorage["varemo"];
      } else {
        this.contrasena = this.user.contrasena;
      }
      this.login();
    }

    this.confirmarModUsuario();
  }

  confirmarModUsuario() {
    const elemento = document.getElementById('id01');
    if (elemento) {
      elemento.style.display = 'block';
    }
  }

  login() {
    console.log(this.user.email);
    console.log(this.user.contrasena);

    const credentials = {
      email: this.user.email,
      contrasena: this.contrasena
    };
    console.log(credentials);

    this.authService.login(credentials).subscribe({
      next: (resp) => {
        // Pilla el token
        console.log(resp);
        console.log(resp.user.token);
        this.token = resp.user.token;

        // Lo guardo en local
        this.jwtService.saveToken(resp.user.token);
        window.localStorage["varemo"] = this.contrasena;
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
