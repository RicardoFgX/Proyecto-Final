import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ProyectService } from '../../../services/proyect.service';
import { TareaService } from '../../../services/tarea.service';
import { UserServiceService } from '../../../services/user-service.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-user-mod-proyects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    // any other modules you need
  ],
  templateUrl: './user-mod-proyects.component.html',
  styleUrl: './user-mod-proyects.component.css'
})
export class UserModProyectsComponent {

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

  tareaNueva = {
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

  objetos1: string[] = ['Item 1', 'Item 2', 'Item 3'];
  objetos2: string[] = [];

  pendiente: any[] = [];
  enProgreso: any[] = [];
  completado: any[] = [];

  tareaModificada = {
    id: '',
    nombre: '',
    descripcion: '',
    fechaVencimiento: '',
    estado: '',
    proyecto: {
      id: ''
    }
  }

  tareaMod: any;

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedItem = event.previousContainer.data[event.previousIndex];
      this.tareaMod = movedItem;
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.tareaMod.estado = event.container.id;
      console.log(`El objeto ${movedItem} ahora está en la columna ${event.container.id}`);
      console.log(this.tareaMod);
      console.log(this.tareaMod.estado);
      this.modificarTareaColumna();
    }
  }

  modificarTareaColumna(): void {
    console.log(this.tarea);
    const token = localStorage.getItem('token');
    if (token) {
      const newTarea = {
        id: this.tareaMod.id,
        nombre: this.tareaMod.nombre,
        descripcion: this.tareaMod.descripcion,
        fechaVencimiento: this.tareaMod.fechaVencimiento,
        estado: this.tareaMod.estado,
        proyecto: {
          id: this.proyecto.id
        }
      }
      this.tareaService.modTarea(newTarea, token).subscribe({
        next: () => {
        },
        error: (error: any) => {
          console.error('Error al guardar la tarea', error);
        },
        complete: () => {
          console.log('Petición para modificar la tarea completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  accionClick(tarea: any) {
    console.log("Le has hecho click")
  }

  nuevatareaForm(estado: string) {
    this.resetearNuevaTarea();
    this.tareaNueva.estado = estado;
    this.tareaNueva.proyecto.id = this.proyecto.id;
    console.log(this.tareaNueva)
    this.openNuevaTarea();
  }

  resetearNuevaTarea() {
    this.tareaNueva = {
      id: '',
      nombre: '',
      descripcion: '',
      fechaVencimiento: '',
      estado: '',
      proyecto: {
        id: ''
      }
    }
  }

  crearTarea(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const newTarea = {
        nombre: this.tareaNueva.nombre,
        descripcion: this.tareaNueva.descripcion,
        fechaVencimiento: this.tareaNueva.fechaVencimiento,
        estado: this.tareaNueva.estado,
        proyecto: {
          id: this.proyecto.id
        }
      }
      this.tareaService.createTarea(newTarea, token).subscribe({
        next: () => {
          this.closeNuevaTarea();
          this.getProyect();
        },
        error: (error: any) => {
          console.error('Error al guardar la tarea', error);
        },
        complete: () => {
          console.log('Petición para modificar la tarea completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }


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

  estadosC() {
    this.completado = this.proyecto.tareas.filter(tarea => tarea.estado === 'COMPLETADA');
    this.enProgreso = this.proyecto.tareas.filter(tarea => tarea.estado === 'EN_PROGRESO');
    this.pendiente = this.proyecto.tareas.filter(tarea => tarea.estado === 'PENDIENTE');

    // Ahora puedes usar estos arrays según tus necesidades
    console.log('Tareas Completadas:', this.completado);
    console.log('Tareas en Progreso:', this.enProgreso);
    console.log('Tareas Pendientes:', this.pendiente);

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
          this.estadosC();
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
    this.router.navigate(['/proyectos']);
  }

  isModalBorrarUserOpen = false;
  isModalBorrarTareaOpen = false;
  isModalNuevoUserOpen = false;
  isModalConfirmarBorrarTareaOpen = false;
  isModalCerrar = false;
  isModalNuevoTareaOpen = false;

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
  openNuevaTarea() {
    this.isModalNuevoTareaOpen = true;
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
  closeNuevaTarea() {
    this.isModalNuevoTareaOpen = false;
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

  confirmarborrarTarea() {
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

  confirmarborrarUsuario(id: number, nombre: any, email: any) {
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

