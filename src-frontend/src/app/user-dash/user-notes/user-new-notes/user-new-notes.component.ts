import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoteService } from '../../../services/note.service';
import { UserServiceService } from '../../../services/user-service.service';
import { jwtDecode } from 'jwt-decode';
import { JwtService } from '../../../services/jwt-service.service';

@Component({
  selector: 'app-user-new-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-new-notes.component.html',
  styleUrl: './user-new-notes.component.css'
})
export class UserNewNotesComponent {
  nota = {
    id: '',
    titulo: '',
    contenido: '',
    usuario: {
      id: ''
    }
  };

  usuario = {
    email: '',
    id: '',
  };

  emailInicial: string = '';


  emailRequest = {
    email: ''
  };

  user = {
    id: '',
    nombre: '',
    apellidos: '',
    email: '',
    contrasena: '',
  };

  userEmail: string | null = null;
  token: string | null = null;

  checkAuthStatus() {
    // Verificar si hay un token guardado en el almacenamiento local
    this.token = this.jwtService.getToken();
    if (this.token != null) {
      try {
        // Decodificar el token para obtener el correo electrónico del usuario
        const decodedToken: any = jwtDecode(this.token);
        console.log(decodedToken?.sub);
        this.emailRequest.email = decodedToken?.sub; // "sub" es el campo donde se almacena el correo electrónico en el token
        console.log(this.emailRequest)
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
      console.log(this.emailRequest)
      this.userService.getUserEmail(this.emailRequest, token).subscribe({
        next: (data: any) => {
          this.user.id = data.id;
          this.usuario.id = data.id;
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

  usuarios: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private noteService: NoteService,
    private jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.checkAuthStatus();
    this.getUser();
  }

  getAllUsers() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getAllUsers(token).subscribe({
        next: (data: any[]) => {
          this.usuarios = data;
        },
        error: (error) => {
          console.error('Error al obtener la lista de usuarios:', error);
        },
        complete: () => {
          console.log('Petición para obtener la lista de usuarios completada');
          console.log(this.usuarios);
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  crearNota(): void {
    const token = localStorage.getItem('token');
    this.buscarIdUsuario();
    if (token) {
        const newNote = {
          id: this.nota.id,
          titulo: this.nota.titulo,
          contenido: this.nota.contenido,
          usuario: {
            id: this.usuario.id
          }
        }
        this.noteService.createNota(newNote, token).subscribe({
          next: () => {
            this.openModalCerrar()
          },
          error: (error: any) => {
            console.error('Error al guardar al usuario', error);
          },
          complete: () => {
            console.log('Petición para modificar el usuario completada'); 
          }
        });
      } else {
      console.error('Algo ocurrió con el token');
    }
  }
  
  irAAdminDashNotas() {
    this.router.navigate(['/notas']);
    }

  isModalOpen = false;
  isModalCerrar = false;

  openModalCerrar() {
    this.isModalCerrar = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
  }

  mostrarIdUsuario(email: string): void {
    const usuarioSeleccionado = this.usuarios.find(usuario => usuario.email === email);
    if (usuarioSeleccionado) {
      console.log('ID del usuario seleccionado:', usuarioSeleccionado.id);
    }
  }

  buscarIdUsuario(): void {
    if (this.usuario.email) {
      const usuario = this.usuarios.find(u => u.email === this.usuario.email);
      if (usuario) {
        console.log('ID del usuario:', usuario.id);
        this.usuario.id = usuario.id
      } else {
        console.log('Usuario no encontrado');
      }
    } else {
      console.log('No se ha seleccionado ningún correo electrónico');
    }
  }
}
