import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectService } from '../../services/proyect.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TareaService } from '../../services/tarea.service';


@Component({
  selector: 'app-admin-dash-mod-proyects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatInputModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-dash-mod-proyects.component.html',
  styleUrl: './admin-dash-mod-proyects.component.css'
})
export class AdminDashModProyectsComponent {
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

  showNotification: boolean = false;
  notificationMessage: string = '';

  estados = ['COMPLETADA', 'EN_PROGRESO', 'PENDIENTE'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private proyectService: ProyectService,
    private tareaService: TareaService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.getProyect();
    console.log(this.proyecto);
    this.ultimaFechaModificacion = this.getFechaActual();
    console.log(this.ultimaFechaModificacion);  // Imprime la fecha de creación en el formato correcto
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

  getProyect(): void {
    // Obtener el ID del usuario de la URL
    const noteID = Number(this.route.snapshot.paramMap.get('id'));
    console.log(noteID);
    const token = localStorage.getItem('token');
    if (token) {
      // Utilizar el servicio de usuario para obtener los datos del usuario por su ID
      this.proyectService.getProyecto(noteID, token).subscribe({
        next: (data: any) => {
          this.proyecto.id = data.id;
          this.proyecto.titulo = data.nombre;
          this.proyecto.descripcion = data.descripcion;
          this.proyecto.fechaCreacion = data.fechaCreacion;
          this.proyecto.integrantes = data.usuarios;
          this.proyecto.tareas = data.tareas;
          console.log(data);
          console.log(this.proyecto.integrantes);
          console.log(this.proyecto.tareas);
        },
        error: (error: any) => {
          console.error('Error al cargar la nota', error);
        },
        complete: () => {
          console.log('Petición para obtener el proyecto completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
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
        this.proyectService.modProyecto(this.proyecto.id, newProyecto, token).subscribe({
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
        this.proyectService.modProyecto(this.proyecto.id, newProyecto, token).subscribe({
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
    this.router.navigate(['/adminDash/proyectos']);
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

  modificarTarea(tarea: any): void {
    this.tarea = tarea;
    this.openBorrarTarea();
    console.log(this.tarea);
  }

  borrarTareaConfirmado(): void {
    console.log(this.usuarioBorradoID);
    if (this.usuarioBorradoID) {
      this.proyecto.integrantes = this.proyecto.integrantes.filter(
        integrante => integrante.id !== this.usuarioBorradoID
      );
    }
  }

  confirmarborrarTarea(){
    this.openConfirmarBorrarTarea();
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
        this.proyecto.integrantes.push(nuevoUsuario);
        this.closeNuevoUser();
      }
    } else {
      console.log('No se ha seleccionado ningún correo electrónico');
    }
  }

  borrarUsuarioConfirmado(): void {
    console.log(this.usuarioBorradoID);
    if (this.usuarioBorradoID) {
      this.proyecto.integrantes = this.proyecto.integrantes.filter(
        integrante => integrante.id !== this.usuarioBorradoID
      );
    }
  }

  confirmarborrarUsuario(id: number, nombre:any, email: any){
      this.usuarioBorradoID = id;
      this.usuarioBorradoNombre = nombre;
      this.usuarioBorradoEmail = email;
      this.openBorrarUser();
  }

  mostrarNotificacion(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  modTarea(id: any) {
    this.router.navigate(['tareas', id], { relativeTo: this.route });
  }

  agregarTarea() {
    this.modificarProyecto2();
    this.router.navigate(['tareas'], { relativeTo: this.route });
  }

  eliminarTarea(): void {
    const token = localStorage.getItem('token');
    if (token) {
        this.tareaService.deleteTarea(this.tarea.id, token).subscribe({
          next: () => {
            this.openConfirmarBorrarTarea();
            this.getProyect();
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
}
