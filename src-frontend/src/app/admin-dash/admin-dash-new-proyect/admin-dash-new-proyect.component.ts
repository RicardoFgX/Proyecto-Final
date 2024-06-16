// Importaciones necesarias de Angular y otros módulos
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-admin-dash-new-proyect', // Selector del componente
  standalone: true, // Indicador de que el componente es autónomo
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatInputModule, MatIconModule, RouterLink, RouterLinkActive, ReactiveFormsModule], // Módulos y componentes importados
  templateUrl: './admin-dash-new-proyect.component.html', // Ruta al archivo de plantilla HTML
  styleUrl: './admin-dash-new-proyect.component.css' // Ruta al archivo de estilos CSS
})
export class AdminDashNewProyectComponent implements OnInit {
  // Declaración del formulario de proyecto y los datos relacionados
  proyectoForm: FormGroup;
  proyecto = {
    id: '',
    titulo: '',
    descripcion: '',
    fechaCreacion: '',
    integrantes: [] as any[],
    tareas: [] as any[]
  };

  tarea = {
    id: '',
    nombre: '',
    descripcion: '',
    fechaVencimiento: '',
    estado: '',
    proyecto: {
      id: ''
    }
  };

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
  blacklistedWords = ['jolines', 'joder'];

  isModalBorrarUserOpen = false;
  isModalBorrarTareaOpen = false;
  isModalNuevoUserOpen = false;
  isModalConfirmarBorrarTareaOpen = false;
  isModalCerrar = false;

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
      titulo: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      descripcion: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      fechaCreacion: [''],
      nuevoUsuario: ['']
    });
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.getAllUsers(); // Obtener la lista de usuarios
    this.proyectoForm.patchValue({
      fechaCreacion: this.getFechaActual() // Asignar la fecha actual al campo de fecha de creación
    });
  }

  // Método para obtener la lista de usuarios
  getAllUsers() {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.userService.getAllUsers(token).subscribe({
        next: (data: any[]) => {
          this.usuarios = data; // Asignar los datos de los usuarios a la lista
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

  // Método para crear un nuevo proyecto
  crearProyecto(): void {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      const newProyecto = {
        nombre: this.proyectoForm.value.titulo,
        descripcion: this.proyectoForm.value.descripcion,
        fechaCreacion: this.proyectoForm.value.fechaCreacion,
        ultimaFechaModificacion: this.proyectoForm.value.fechaCreacion,
        usuarios: this.proyecto.integrantes.map((integrante: any) => ({ id: integrante.id }))
      };
      this.proyectService.createProyecto(newProyecto, token).subscribe({
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

  // Método para navegar de vuelta a la lista de proyectos del administrador
  irAAdminDashProyectos() {
    this.router.navigate(['/adminDash/proyectos']);
  }

  // Métodos para abrir y cerrar modales
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

  // Método para buscar el ID del usuario seleccionado
  buscarIdUsuario(): void {
    if (this.usuario.email) {
      const usuario = this.usuarios.find(u => u.email === this.usuario.email);
      if (usuario) {
        this.usuario.id = usuario.id;
      }
    } 
  }

  // Método para agregar un integrante al proyecto
  agregarIntegrante(): void {
    this.openNuevoUser();
  }

  // Método para obtener la fecha actual en formato YYYY-MM-DD
  getFechaActual(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  // Método para modificar una tarea
  modificarTarea(tarea: any): void {
    this.tarea = tarea;
    this.openBorrarTarea();
  }

  // Método para confirmar la eliminación de una tarea
  borrarTareaConfirmado(): void {
    if (this.usuarioBorradoID) {
      this.proyecto.integrantes = this.proyecto.integrantes.filter(
        integrante => integrante.id !== this.usuarioBorradoID
      );
    }
  }

  // Método para abrir el modal de confirmación de eliminación de tarea
  confirmarborrarTarea() {
    this.openConfirmarBorrarTarea();
  }

  // Método para agregar un usuario al proyecto
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

  // Método para confirmar la eliminación de un usuario del proyecto
  borrarUsuarioConfirmado(): void {
    if (this.usuarioBorradoID) {
      this.proyecto.integrantes = this.proyecto.integrantes.filter(
        integrante => integrante.id !== this.usuarioBorradoID
      );
    }
  }

  // Método para abrir el modal de confirmación de eliminación de usuario
  confirmarborrarUsuario(id: number, nombre: any, email: any) {
    this.usuarioBorradoID = id;
    this.usuarioBorradoNombre = nombre;
    this.usuarioBorradoEmail = email;
    this.openBorrarUser();
  }

  // Método para mostrar notificaciones
  mostrarNotificacion(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  // Método para navegar a la ruta de modificación de tareas
  modTarea(id: any) {
    this.router.navigate(['tareas', id], { relativeTo: this.route });
  }

  // Método para agregar una tarea
  agregarTarea() {
    this.crearProyecto();
    this.router.navigate(['tareas'], { relativeTo: this.route });
  }

  // Validador personalizado para palabras prohibidas
  blacklistValidator(blacklistedWords: string[]) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
        return null; // Si no hay valor, no hay error
      }
      const hasBlacklistedWord = blacklistedWords.some(word => control.value.includes(word)); // Verificar si hay palabras prohibidas
      return hasBlacklistedWord ? { blacklisted: true } : null; // Retornar error si se encuentra una palabra prohibida
    };
  }
}
