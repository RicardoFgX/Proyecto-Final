import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ProyectService } from '../../../services/proyect.service';
import { TareaService } from '../../../services/tarea.service';
import { UserServiceService } from '../../../services/user-service.service';
import { jwtDecode } from 'jwt-decode';
import { JwtService } from '../../../services/jwt-service.service';

@Component({
  selector: 'app-user-new-proyects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatInputModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './user-new-proyects.component.html',
  styleUrl: './user-new-proyects.component.css'
})
export class UserNewProyectsComponent {
  proyecto = {
    id: '',
    titulo: '',
    descripcion: '',
    fechaCreacion: '',
    integrantes: [] as any[],
    tareas: [] as any[]
  };

  ultimaFechaModificacion: string = '';

  tarea = {
    id: '',
    nombre: '',
    descripcion: '',
    fechaVencimiento: '',
    estado: '',
    proyecto: {
      id: ''
    }
  }

  usuario = {
    email: '',
    nombre: '',
    id: '',
  };

  usuarioN = {
    email: '',
    nombre: '',
    id: '',
  };

  usuarioBorradoID: any;
  usuarioBorradoEmail: any;
  usuarioBorradoNombre: any;


  usuarios: any[] = [];

  usuarioActual = {
    email: '',
    nombre: '',
    id: '',
  };

  showNotification: boolean = false;
  notificationMessage: string = '';

  estados = ['COMPLETADA', 'EN_PROGRESO', 'PENDIENTE'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private proyectService: ProyectService,
    private tareaService: TareaService,
    private jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.proyecto.integrantes.push(this.usuarioActual);
    this.checkAuthStatus();
    this.getUser();
    this.getAllUsers();
    console.log(this.proyecto);
    this.ultimaFechaModificacion = this.getFechaActual();
    this.proyecto.fechaCreacion = this.getFechaActual();
    console.log(this.ultimaFechaModificacion);  // Imprime la fecha de creación en el formato correcto
  }


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
          this.usuarioActual.id = data.id;
          this.usuarioActual.nombre = data.nombre;
          this.usuarioActual.email = data.email;
          console.log(this.usuarioActual);
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

  modificarProyecto(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const newProyecto = {
        nombre: this.proyecto.titulo,
        descripcion: this.proyecto.descripcion,
        fechaCreacion: this.proyecto.fechaCreacion,
        ultimaFechaModificacion: this.proyecto.fechaCreacion,
        usuarios: this.proyecto.integrantes.map((integrante: any) => ({ id: integrante.id }))
      }
      console.log(newProyecto);
      this.proyectService.createProyecto(newProyecto, token).subscribe({
        next: () => {
          this.openModalCerrar();
        },
        error: (error: any) => {
          console.error('Error al guardar el proyecto', error);
        },
        complete: () => {
          console.log('Petición para modificar el proyecto completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  modificarProyecto2(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const newProyecto = {
        nombre: this.proyecto.titulo,
        descripcion: this.proyecto.descripcion,
        fechaCreacion: this.proyecto.fechaCreacion,
        ultimaFechaModificacion: this.proyecto.fechaCreacion,
        usuarios: this.proyecto.integrantes.map((integrante: any) => ({ id: integrante.id }))
      }
      console.log(newProyecto);
      this.proyectService.createProyecto(newProyecto, token).subscribe({
        next: () => {
        },
        error: (error: any) => {
          console.error('Error al guardar el proyecto', error);
        },
        complete: () => {
          console.log('Petición para modificar el proyecto completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  irAAdminDashProyectos() {
    this.router.navigate(['/proyectos']);
  }

  isModalBorrarUserOpen = false;
  isModalBorrarTareaOpen = false;
  isModalNuevoUserOpen = false;
  isModalConfirmarBorrarTareaOpen = false;
  isModalCerrar = false;

  openModalCerrar() {
    this.isModalCerrar = true;
  }
  openBorrarUser() {
    this.isModalBorrarUserOpen = true;
  }
  openNuevoUser() {
    this.isModalNuevoUserOpen = true;
  }
  openBorrarTarea() {
    this.isModalBorrarTareaOpen = true;
  }
  openConfirmarBorrarTarea() {
    this.isModalConfirmarBorrarTareaOpen = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
  }
  closeBorrarUser() {
    this.isModalBorrarUserOpen = false;
  }
  closeNuevoUser() {
    this.isModalNuevoUserOpen = false;
  }
  closeBorrarTarea() {
    this.isModalBorrarTareaOpen = false;
  }
  closeConfirmarBorrarTarea() {
    this.isModalConfirmarBorrarTareaOpen = false;
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

  confirmarModProyecto() {
    const elemento = document.getElementById('id03');
    if (elemento) {
      elemento.style.display = 'block';
    }
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

  agregarIntegrante(): void {
    this.openNuevoUser();
  }

  getFechaActual(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  agregarUsuario(): void {
    console.log(this.usuarioN.email);
    if (this.usuarioN.email) {
      const usuarioExistente = this.proyecto.integrantes.find(u => u.email === this.usuarioN.email);
      if (usuarioExistente) {
        console.log('El usuario ya existe en la lista de integrantes del proyecto.');
        this.mostrarNotificacion('El usuario ya existe en la lista de integrantes del proyecto.');
      } else {
        console.log(this.usuarioN);
        console.log('Usuario no encontrado, se añadirá a la lista de integrantes del proyecto.');
        // Crear un nuevo usuario para agregarlo a la lista
        const nuevoUsuario = {
          id: this.usuarioN.id, // Podrías generar un ID único aquí
          nombre: this.usuarioN.nombre, // Agrega el nombre si tienes esta información disponible
          email: this.usuarioN.email
        };
        // Agregar el nuevo usuario a la lista de integrantes del proyecto
        this.closeNuevoUser();
        this.proyecto.integrantes.push(nuevoUsuario);
      }
    } else {
      console.log('No se ha seleccionado ningún correo electrónico');
      this.closeNuevoUser();
    }
  }



  borrarUsuarioConfirmado(): void {
    console.log(this.usuarioBorradoID);
    const usuarioActual = this.usuarioBorradoID === this.usuarioActual.id;
    console.log(usuarioActual);
    if (usuarioActual) {
      console.log('Eres tu');
        this.mostrarNotificacion('No puede borrar a este usuario del proyecto');
    } else {
      if (this.usuarioBorradoID) {
        this.proyecto.integrantes = this.proyecto.integrantes.filter(
          integrante => integrante.id !== this.usuarioBorradoID
        );
      }
    }

  }

  confirmarborrarUsuario(id: number, nombre: any, email: any) {
    this.usuarioBorradoID = id;
    this.usuarioBorradoNombre = nombre;
    this.usuarioBorradoEmail = email;
    this.openBorrarUser();
  }

  mostrarNotificacion(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;

    // Oculta la notificación después de 3 segundos
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  modTarea(id: any) {
    // Navegar a la ruta relativa 'tarea/tarea.id' desde la ruta actual
    this.router.navigate(['tareas', id], { relativeTo: this.route });
  }

  agregarTarea() {
    this.modificarProyecto2();
    this.router.navigate(['tareas'], { relativeTo: this.route });
  }

}

