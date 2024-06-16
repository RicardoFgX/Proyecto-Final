import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    ReactiveFormsModule
  ],
  templateUrl: './user-mod-proyects.component.html',
  styleUrls: ['./user-mod-proyects.component.css']
})
export class UserModProyectsComponent implements OnInit {
  proyectoForm: FormGroup;
  tareaNuevaForm: FormGroup;
  tareaModForm: FormGroup;

  blacklistedWords = [
    'maricón', 'puto', 'joder', 'mierda', 'cabrón', 'cabron', 'bastardo'
  ];

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
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private proyectService: ProyectService,
    private tareaService: TareaService,
    private jwtService: JwtService
  ) {
    this.proyectoForm = this.fb.group({
      titulo: ['', [Validators.required, this.blacklistValidator.bind(this)]],
      descripcion: ['', [Validators.required, this.blacklistValidator.bind(this)]],
      fechaCreacion: [{ value: '', disabled: true }]
    });

    this.tareaNuevaForm = this.fb.group({
      nombre: ['', [Validators.required, this.blacklistValidator.bind(this)]],
      descripcion: ['', this.blacklistValidator.bind(this)],
      fechaVencimiento: ['']
    });

    this.tareaModForm = this.fb.group({
      nombre: ['', [Validators.required, this.blacklistValidator.bind(this)]],
      descripcion: ['', this.blacklistValidator.bind(this)],
      fechaVencimiento: ['']
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getProyect();
    this.ultimaFechaModificacion = this.getFechaActual();
    this.checkAuthStatus();
  }

  // Validador de lista negra para los campos de formulario
  blacklistValidator(control: any) {
    const value = control.value;
    for (let word of this.blacklistedWords) {
      if (value?.toLowerCase().includes(word.toLowerCase())) {
        return { blacklisted: true };
      }
    }
    return null;
  }

  // Manejar el evento de arrastrar y soltar para las tareas
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

  // Modificar tarea al cambiar de columna
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
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Abrir formulario para nueva tarea
  nuevatareaForm(estado: string) {
    this.resetearNuevaTarea();
    this.tareaNueva.estado = estado;
    this.tareaNueva.proyecto.id = this.proyecto.id;
    this.openNuevaTarea();
  }

  // Resetear datos de nueva tarea
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

  // Resetear datos de tarea modificada
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

  // Abrir formulario para modificar tarea
  modtareaForm(tarea: any) {
    this.tareaModificada.id = tarea.id;
    this.tareaModificada.estado = tarea.estado;
    this.tareaModificada.proyecto.id = this.proyecto.id;
    this.tareaModificada.nombre = tarea.nombre;
    this.tareaModificada.descripcion = tarea.descripcion;
    this.tareaModificada.fechaVencimiento = tarea.fechaVencimiento;

    this.tareaModForm.patchValue({
      nombre: tarea.nombre,
      descripcion: tarea.descripcion,
      fechaVencimiento: tarea.fechaVencimiento
    });
    this.isModalModTareaOpen = true;
  }

  // Modificar tarea existente
  modificarTarea(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const modTarea = {
        id: this.tareaModificada.id,
        nombre: this.tareaModForm.value.nombre,
        descripcion: this.tareaModForm.value.descripcion,
        fechaVencimiento: this.tareaModForm.value.fechaVencimiento,
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
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Crear nueva tarea
  crearTarea(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const newTarea = {
        nombre: this.tareaNuevaForm.value.nombre,
        descripcion: this.tareaNuevaForm.value.descripcion,
        fechaVencimiento: this.tareaNuevaForm.value.fechaVencimiento,
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
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Modificar proyecto existente
  modificarProyecto(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const newProyecto = {
        nombre: this.proyectoForm.value.titulo,
        descripcion: this.proyectoForm.value.descripcion,
        fechaCreacion: this.proyecto.fechaCreacion,
        ultimaFechaModificacion: this.ultimaFechaModificacion,
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
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Modificar proyecto sin abrir modal
  modificarProyecto2(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const newProyecto = {
        nombre: this.proyectoForm.value.titulo,
        descripcion: this.proyectoForm.value.descripcion,
        fechaCreacion: this.proyecto.fechaCreacion,
        ultimaFechaModificacion: this.ultimaFechaModificacion,
        usuarios: this.proyecto.integrantes.map((integrante: any) => ({ id: integrante.id }))
      }
      this.proyectService.modProyecto(this.proyecto.id, newProyecto, token).subscribe({
        next: () => {},
        error: (error: any) => {
          console.error('Error al guardar el proyecto', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Navegar a la página de proyectos
  irAAdminDashProyectos() {
    this.router.navigate(['/proyectos']);
  }

  // Abrir modal de cierre
  openModalCerrar() {
    this.isModalCerrar = true;
  }
  // Abrir modal para borrar usuario
  openBorrarUser() {
    this.isModalBorrarUserOpen = true;
  }
  // Abrir modal para borrar usuario actual
  openBorrarUserActual() {
    this.isModalBorrarUserActualOpen = true;
  }
  // Abrir modal para nuevo usuario
  openNuevoUser() {
    this.isModalNuevoUserOpen = true;
  }
  // Abrir modal para borrar tarea
  openBorrarTarea() {
    this.isModalBorrarTareaOpen = true;
  }
  // Abrir modal para confirmar borrar tarea
  openConfirmarBorrarTarea() {
    this.isModalConfirmarBorrarTareaOpen = true;
  }
  // Abrir modal para nueva tarea
  openNuevaTarea() {
    this.isModalNuevoTareaOpen = true;
  }
  // Abrir modal para modificar tarea
  openModTarea() {
    this.isModalModTareaOpen = true;
  }

  // Cerrar modal de cierre
  closeModalCerrar() {
    this.isModalCerrar = false;
  }
  // Cerrar modal para borrar usuario
  closeBorrarUser() {
    this.isModalBorrarUserOpen = false;
  }
  // Cerrar modal para borrar usuario actual
  closeBorrarUserActual() {
    this.isModalBorrarUserActualOpen = false;
  }
  // Cerrar modal para nuevo usuario
  closeNuevoUser() {
    this.isModalNuevoUserOpen = false;
  }
  // Cerrar modal para borrar tarea
  closeBorrarTarea() {
    this.isModalBorrarTareaOpen = false;
  }
  // Cerrar modal para confirmar borrar tarea
  closeConfirmarBorrarTarea() {
    this.isModalConfirmarBorrarTareaOpen = false;
  }
  // Cerrar modal para nueva tarea
  closeNuevaTarea() {
    this.isModalNuevoTareaOpen = false;
  }
  // Cerrar modal para modificar tarea
  closeModTarea() {
    this.isModalModTareaOpen = false;
  }

  // Mostrar ID de usuario seleccionado
  mostrarIdUsuario(email: string): void {
    const usuarioSeleccionado = this.usuarios.find(usuario => usuario.email === email);
    if (usuarioSeleccionado) {
      console.log('ID del usuario seleccionado:', usuarioSeleccionado.id);
    }
  }

  // Buscar ID de usuario basado en email
  buscarIdUsuario(): void {
    if (this.usuario.email) {
      const usuario = this.usuarios.find(u => u.email === this.usuario.email);
      if (usuario) {
        this.usuario.id = usuario.id
      }
    } 
  }

  // Agregar un nuevo integrante
  agregarIntegrante(): void {
    this.openNuevoUser();
  }

  // Obtener fecha actual en formato YYYY-MM-DD
  getFechaActual(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Actualizar listas de tareas basadas en su estado
  estadosC() {
    this.completado = this.proyecto.tareas.filter(tarea => tarea.estado === 'COMPLETADA');
    this.enProgreso = this.proyecto.tareas.filter(tarea => tarea.estado === 'EN_PROGRESO');
    this.pendiente = this.proyecto.tareas.filter(tarea => tarea.estado === 'PENDIENTE');
  }

  // Obtener todos los usuarios
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
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  // Obtener detalles del proyecto
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
          this.proyectoForm.patchValue({
            titulo: this.proyecto.titulo,
            descripcion: this.proyecto.descripcion,
            fechaCreacion: this.proyecto.fechaCreacion
          });
        },
        error: (error: any) => {
          console.error('Error al cargar el proyecto', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Agregar un nuevo usuario al proyecto
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
    } 
  }

  // Borrar un usuario del proyecto
  borrarUsuarioConfirmado(): void {
    if (this.usuarioBorradoID && this.usuarioBorradoEmail !== this.emailUsuario) {
      this.proyecto.integrantes = this.proyecto.integrantes.filter(
        integrante => integrante.id !== this.usuarioBorradoID
      );
    } else {
      this.openBorrarUserActual();
    }
  }

  // Confirmar y borrar el usuario actual del proyecto
  borrarUsuarioActualConfirmado(): void {
    if (this.usuarioBorradoID) {
      this.proyecto.integrantes = this.proyecto.integrantes.filter(
        integrante => integrante.id !== this.usuarioBorradoID
      );
      this.modificarProyecto();
    } 
  }

  // Confirmar borrar usuario y abrir modal
  confirmarborrarUsuario(id: number, nombre: any, email: any) {
    this.usuarioBorradoID = id;
    this.usuarioBorradoNombre = nombre;
    this.usuarioBorradoEmail = email;
    this.openBorrarUser();
  }

  // Mostrar notificación en la pantalla
  mostrarNotificacion(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  // Navegar a la página de tareas para modificar
  modTarea(id: any) {
    this.router.navigate(['tareas', id], { relativeTo: this.route });
  }

  // Agregar una nueva tarea y navegar a la página de tareas
  agregarTarea() {
    this.modificarProyecto2();
    this.router.navigate(['tareas'], { relativeTo: this.route });
  }

  // Eliminar una tarea del proyecto
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
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Confirmar borrar tarea
  confirmarBorrarTarea() {
    this.openBorrarTarea();
  }

  // Confirmar eliminación de tarea
  confirmDelete() {
    this.eliminarTarea();
    this.closeBorrarTarea();
  }

  // Verificar estado de autenticación
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
