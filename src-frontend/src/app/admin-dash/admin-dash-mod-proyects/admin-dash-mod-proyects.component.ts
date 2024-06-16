// Importaciones necesarias de Angular y otros módulos
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { ProyectService } from '../../services/proyect.service';
import { TareaService } from '../../services/tarea.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Decorador @Component para definir metadatos del componente
@Component({
  selector: 'app-admin-dash-mod-proyects', // Selector del componente
  standalone: true, // Indicador de que el componente es autónomo
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    MatCardModule, 
    MatInputModule, 
    MatIconModule, 
    RouterLink, 
    RouterLinkActive, 
    ReactiveFormsModule
  ], // Módulos y componentes importados
  templateUrl: './admin-dash-mod-proyects.component.html', // Ruta al archivo de plantilla HTML
  styleUrl: './admin-dash-mod-proyects.component.css' // Ruta al archivo de estilos CSS
})
export class AdminDashModProyectsComponent {
  // Inicialización de variables para el proyecto, tarea y usuario
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
    proyecto: { id: '' }
  };

  usuario = { email: '', nombre: '', id: '' };
  usuarioN = { email: '', nombre: '', id: '' };
  usuarioBorradoID: any;
  usuarioBorradoEmail: any;
  usuarioBorradoNombre: any;

  usuarios: any[] = [];
  showNotification: boolean = false;
  notificationMessage: string = '';
  estados = ['COMPLETADA', 'EN_PROGRESO', 'PENDIENTE'];

  proyectoForm: FormGroup;
  blacklistedWords = ['jolines', 'joder'];

  // Constructor para inyectar servicios y form builder
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private proyectService: ProyectService,
    private tareaService: TareaService
  ) {
    // Inicialización del formulario con validaciones
    this.proyectoForm = this.fb.group({
      id: [''],
      titulo: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      descripcion: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      fechaCreacion: [''],
      integrantes: this.fb.array([]),
      tareas: this.fb.array([]),
      nuevoUsuario: ['']
    });
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.getAllUsers(); // Obtener todos los usuarios
    this.getProyect(); // Obtener los datos del proyecto a modificar
    this.ultimaFechaModificacion = this.getFechaActual(); // Obtener la fecha actual
  }

  // Método para obtener todos los usuarios
  getAllUsers() {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.userService.getAllUsers(token).subscribe({
        next: (data: any[]) => {
          this.usuarios = data; // Asignar los datos obtenidos al array de usuarios
        },
        error: (error) => {
          console.error('Error al obtener la lista de usuarios:', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

  // Método para obtener los datos del proyecto a modificar
  getProyect(): void {
    const noteID = Number(this.route.snapshot.paramMap.get('id')); // Obtener el ID del proyecto de los parámetros de la ruta
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.proyectService.getProyecto(noteID, token).subscribe({
        next: (data: any) => {
          // Asignar los datos del proyecto a los campos del formulario
          this.proyectoForm.patchValue({
            id: data.id,
            titulo: data.nombre,
            descripcion: data.descripcion,
            fechaCreacion: data.fechaCreacion,
          });
          this.proyecto.integrantes = data.usuarios;
          this.proyecto.tareas = data.tareas;
        },
        error: (error: any) => {
          console.error('Error al cargar el proyecto', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Método para modificar el proyecto
  modificarProyecto(): void {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      const newProyecto = {
        nombre: this.proyectoForm.value.titulo,
        descripcion: this.proyectoForm.value.descripcion,
        fechaCreacion: this.proyectoForm.value.fechaCreacion,
        ultimaFechaModificacion: this.ultimaFechaModificacion,
        usuarios: this.proyecto.integrantes.map((integrante: any) => ({ id: integrante.id }))
      };
      this.proyectService.modProyecto(this.proyectoForm.value.id, newProyecto, token).subscribe({
        next: () => {
          this.openModalCerrar(); // Abrir el modal de confirmación de éxito
        },
        error: (error: any) => {
          console.error('Error al guardar el proyecto', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Método adicional para modificar el proyecto (necesario para agregar una tarea)
  modificarProyecto2(): void {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      const newProyecto = {
        nombre: this.proyectoForm.value.titulo,
        descripcion: this.proyectoForm.value.descripcion,
        fechaCreacion: this.proyectoForm.value.fechaCreacion,
        ultimaFechaModificacion: this.ultimaFechaModificacion,
        usuarios: this.proyecto.integrantes.map((integrante: any) => ({ id: integrante.id }))
      };
      this.proyectService.modProyecto(this.proyectoForm.value.id, newProyecto, token).subscribe({
        next: () => {},
        error: (error: any) => {
          console.error('Error al guardar el proyecto', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Navegar de vuelta a la lista de proyectos del administrador
  irAAdminDashProyectos() {
    this.router.navigate(['/adminDash/proyectos']);
  }

  // Variables para controlar la visibilidad de los modales
  isModalBorrarUserOpen = false;
  isModalBorrarTareaOpen = false;
  isModalNuevoUserOpen = false;
  isModalConfirmarBorrarTareaOpen = false;
  isModalCerrar = false;

  // Métodos para abrir los modales
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

  // Métodos para cerrar los modales
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

  // Buscar y asignar el ID del usuario asociado al email seleccionado en el formulario
  buscarIdUsuario(): void {
    if (this.usuario.email) {
      const usuario = this.usuarios.find(u => u.email === this.usuario.email);
      if (usuario) {
        this.usuario.id = usuario.id;
      }
    }
  }

  // Agregar un nuevo integrante al proyecto
  agregarIntegrante(): void {
    this.openNuevoUser();
  }

  // Obtener la fecha actual en formato AAAA-MM-DD
  getFechaActual(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Modificar una tarea seleccionada
  modificarTarea(tarea: any): void {
    this.tarea = tarea;
    this.openBorrarTarea();
  }

  // Confirmar el borrado de una tarea
  borrarTareaConfirmado(): void {
    if (this.usuarioBorradoID) {
      this.proyecto.integrantes = this.proyecto.integrantes.filter(
        integrante => integrante.id !== this.usuarioBorradoID
      );
    }
  }

  // Confirmar el borrado de una tarea
  confirmarborrarTarea() {
    this.openConfirmarBorrarTarea();
  }

  // Agregar un usuario al proyecto
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

  // Confirmar el borrado de un usuario del proyecto
  borrarUsuarioConfirmado(): void {
    if (this.usuarioBorradoID) {
      this.proyecto.integrantes = this.proyecto.integrantes.filter(
        integrante => integrante.id !== this.usuarioBorradoID
      );
    }
  }

  // Confirmar el borrado de un usuario del proyecto
  confirmarborrarUsuario(id: number, nombre: any, email: any) {
    this.usuarioBorradoID = id;
    this.usuarioBorradoNombre = nombre;
    this.usuarioBorradoEmail = email;
    this.openBorrarUser();
  }

  // Mostrar una notificación
  mostrarNotificacion(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  // Navegar a la vista de tareas para modificar una tarea específica
  modTarea(id: any) {
    this.router.navigate(['tareas', id], { relativeTo: this.route });
  }

  // Navegar a la vista de tareas para agregar una nueva tarea
  agregarTarea() {
    this.modificarProyecto2();
    this.router.navigate(['tareas'], { relativeTo: this.route });
  }

  // Eliminar una tarea específica
  eliminarTarea(): void {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.tareaService.deleteTarea(this.tarea.id, token).subscribe({
        next: () => {
          this.openConfirmarBorrarTarea(); // Abrir el modal de confirmación de éxito
          this.getProyect(); // Actualizar la lista de tareas
        },
        error: (error: any) => {
          console.error('Error al eliminar la tarea', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Validador personalizado para palabras prohibidas
  blacklistValidator(blacklistedWords: string[]) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
        return null;
      }
      const hasBlacklistedWord = blacklistedWords.some(word => control.value.includes(word));
      return hasBlacklistedWord ? { blacklisted: true } : null;
    };
  }
}
