import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProyectService } from '../../../services/proyect.service';
import { TareaService } from '../../../services/tarea.service';
import { UserServiceService } from '../../../services/user-service.service';
import { jwtDecode } from 'jwt-decode';
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
import { JwtService } from '../../../services/jwt-service.service';

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
  ],
  templateUrl: './user-mod-proyects.component.html',
  styleUrls: ['./user-mod-proyects.component.css']
})
export class UserModProyectsComponent implements OnInit {
  proyecto = {
    id: '',
    titulo: '',
    descripcion: '',
    fechaCreacion: '',
    integrantes: [] as any[],
    tareas: [] as any[]
  };

  token: string | null = null;

  emailUsuario: string = '';
  
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

  isModalBorrarUserOpen = false;
  isModalBorrarUserActualOpen = false;
  isModalBorrarTareaOpen = false;
  isModalNuevoUserOpen = false;
  isModalConfirmarBorrarTareaOpen = false;
  isModalCerrar = false;
  isModalNuevoTareaOpen = false;
  isModalModTareaOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private proyectService: ProyectService,
    private tareaService: TareaService,
    private jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.getProyect();
    this.ultimaFechaModificacion = this.getFechaActual();
    this.checkAuthStatus();
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedItem = event.previousContainer.data[event.previousIndex];
      this.tareaMod = movedItem;
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.tareaMod.estado = event.container.id;
      this.modificarTareaColumna();
    }
  }

  modificarTareaColumna(): void {
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
        next: () => {},
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

  nuevatareaForm(estado: string) {
    this.resetearNuevaTarea();
    this.tareaNueva.estado = estado;
    this.tareaNueva.proyecto.id = this.proyecto.id;
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

  resetearModTarea() {
    this.tareaModificada = {
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

  modtareaForm(tarea: any) {
    this.tareaModificada.id = tarea.id;
    this.tareaModificada.estado = tarea.estado;
    this.tareaModificada.proyecto.id = this.proyecto.id;
    this.tareaModificada.nombre = tarea.nombre;
    this.tareaModificada.descripcion = tarea.descripcion;
    this.tareaModificada.fechaVencimiento = tarea.fechaVencimiento;
    this.openModTarea();
  }

  modificarTarea(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const modTarea = {
        id: this.tareaModificada.id,
        nombre: this.tareaModificada.nombre,
        descripcion: this.tareaModificada.descripcion,
        fechaVencimiento: this.tareaModificada.fechaVencimiento,
        estado: this.tareaModificada.estado,
        proyecto: {
          id: this.proyecto.id
        }
      }
      this.tareaService.modTarea(modTarea, token).subscribe({
        next: () => {
          this.closeModTarea();
          this.getProyect();
          this.resetearModTarea();
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
      this.proyectService.modProyecto(this.proyecto.id, newProyecto, token).subscribe({
        next: () => {},
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

  openModalCerrar() {
    this.isModalCerrar = true;
  }
  openBorrarUser() {
    this.isModalBorrarUserOpen = true;
  }
  openBorrarUserActual() {
    this.isModalBorrarUserActualOpen = true;
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
  openModTarea() {
    this.isModalModTareaOpen = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
  }
  closeBorrarUser() {
    this.isModalBorrarUserOpen = false;
  }
  closeBorrarUserActual() {
    this.isModalBorrarUserActualOpen = false;
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
  closeModTarea() {
    this.isModalModTareaOpen = false;
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

  estadosC() {
    this.completado = this.proyecto.tareas.filter(tarea => tarea.estado === 'COMPLETADA');
    this.enProgreso = this.proyecto.tareas.filter(tarea => tarea.estado === 'EN_PROGRESO');
    this.pendiente = this.proyecto.tareas.filter(tarea => tarea.estado === 'PENDIENTE');
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
    const noteID = Number(this.route.snapshot.paramMap.get('id'));
    const token = localStorage.getItem('token');
    if (token) {
      this.proyectService.getProyecto(noteID, token).subscribe({
        next: (data: any) => {
          this.proyecto.id = data.id;
          this.proyecto.titulo = data.nombre;
          this.proyecto.descripcion = data.descripcion;
          this.proyecto.fechaCreacion = data.fechaCreacion;
          this.proyecto.integrantes = data.usuarios;
          this.proyecto.tareas = data.tareas;
          this.estadosC();
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

  agregarUsuario(): void {
    if (this.usuarioN.email) {
      const usuarioExistente = this.proyecto.integrantes.find(u => u.email === this.usuarioN.email);
      if (usuarioExistente) {
        this.mostrarNotificacion('El usuario ya existe en la lista de integrantes del proyecto.');
      } else {
        const nuevoUsuario = {
          id: this.usuarioN.id,
          nombre: this.usuarioN.nombre,
          email: this.usuarioN.email
        };
        this.proyecto.integrantes.push(nuevoUsuario);
        this.closeNuevoUser();
      }
    } else {
      console.log('No se ha seleccionado ningún correo electrónico');
    }
  }

  borrarUsuarioConfirmado(): void {
    if (this.usuarioBorradoID && this.usuarioBorradoEmail !== this.emailUsuario) {
      this.proyecto.integrantes = this.proyecto.integrantes.filter(
        integrante => integrante.id !== this.usuarioBorradoID
      );
    } else {
      this.openBorrarUserActual();
    }
  }

  borrarUsuarioActualConfirmado(): void {
    if (this.usuarioBorradoID) {
      this.proyecto.integrantes = this.proyecto.integrantes.filter(
        integrante => integrante.id !== this.usuarioBorradoID
      );
      this.modificarProyecto();
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
      this.tareaService.deleteTarea(this.tareaModificada.id, token).subscribe({
        next: () => {
          this.closeModTarea();
          this.closeBorrarTarea();
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

  confirmarBorrarTarea() {
    this.openBorrarTarea();
  }

  confirmDelete() {
    this.eliminarTarea();
    this.closeBorrarTarea();
  }

  checkAuthStatus() {
    // Verificar si hay un token guardado en el almacenamiento local
    this.token = this.jwtService.getToken();
    if (this.token != null) {
      try {
        // Decodificar el token para obtener el correo electrónico del usuario
        const decodedToken: any = jwtDecode(this.token);
        this.emailUsuario = decodedToken?.sub; // "sub" es el campo donde se almacena el correo electrónico en el token
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }
}
