import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatInputModule, MatIconModule, RouterLink, RouterLinkActive, ReactiveFormsModule, FormsModule],
  templateUrl: './user-new-proyects.component.html',
  styleUrls: ['./user-new-proyects.component.css']
})
export class UserNewProyectsComponent implements OnInit {
  proyectoForm: FormGroup;

  // Palabras prohibidas
  blacklistedWords = [
    'maricón', 'puto', 'joder', 'mierda', 'cabrón', 'cabron', 'bastardo'
  ];

  // Objeto de proyecto
  proyecto = {
    id: '',
    titulo: '',
    descripcion: '',
    fechaCreacion: '',
    integrantes: [] as any[],
    tareas: [] as any[]
  };

  // Fecha de la última modificación
  ultimaFechaModificacion: string = '';

  // Objeto de tarea
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

  // Objeto de usuario actual
  usuario = {
    email: '',
    nombre: '',
    id: '',
  };

  // Objeto para el nuevo usuario
  usuarioN = {
    email: '',
    nombre: '',
    id: '',
  };

  // Variables para el usuario que se va a borrar
  usuarioBorradoID: any;
  usuarioBorradoEmail: any;
  usuarioBorradoNombre: any;

  // Lista de usuarios
  usuarios: any[] = [];

  // Información del usuario actual
  usuarioActual = {
    email: '',
    nombre: '',
    id: '',
  };

  // Variables de notificación
  showNotification: boolean = false;
  notificationMessage: string = '';

  // Lista de estados de tarea
  estados = ['COMPLETADA', 'EN_PROGRESO', 'PENDIENTE'];

  // Variables de autenticación
  userEmail: string | null = null;
  token: string | null = null;

  // Objeto para la solicitud de email
  emailRequest = {
    email: ''
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private proyectService: ProyectService,
    private tareaService: TareaService,
    private jwtService: JwtService
  ) {
    // Inicializar el formulario del proyecto con validadores
    this.proyectoForm = this.fb.group({
      titulo: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      descripcion: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      fechaCreacion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Agregar el usuario actual a la lista de integrantes del proyecto
    this.proyecto.integrantes.push(this.usuarioActual);
    // Verificar el estado de autenticación y cargar la información del usuario
    this.checkAuthStatus();
    this.getUser();
    this.getAllUsers();
    // Establecer la fecha de creación y la última fecha de modificación del proyecto
    this.ultimaFechaModificacion = this.getFechaActual();
    this.proyectoForm.patchValue({
      fechaCreacion: this.getFechaActual()
    });
  }

  // Validador para comprobar si el texto contiene palabras prohibidas
  blacklistValidator(blacklist: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const hasBlacklistedWord = blacklist.some(word => control.value.toLowerCase().includes(word.toLowerCase()));
      return hasBlacklistedWord ? { 'blacklisted': true } : null;
    };
  }

  // Verificar si el usuario está autenticado
  checkAuthStatus() {
    this.token = this.jwtService.getToken();
    if (this.token != null) {
      try {
        const decodedToken: any = jwtDecode(this.token);
        this.emailRequest.email = decodedToken?.sub;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  // Obtener la información del usuario actual
  getUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserEmail(this.emailRequest, token).subscribe({
        next: (data: any) => {
          this.usuarioActual.id = data.id;
          this.usuarioActual.nombre = data.nombre;
          this.usuarioActual.email = data.email;
        },
        error: (error) => {
          console.error('Error al cargar al usuario', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Obtener la lista de todos los usuarios
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

  // Modificar el proyecto
  modificarProyecto(): void {
    const token = localStorage.getItem('token');
    if (token && this.proyectoForm.valid) {
      const newProyecto = {
        nombre: this.proyectoForm.value.titulo,
        descripcion: this.proyectoForm.value.descripcion,
        fechaCreacion: this.proyectoForm.value.fechaCreacion,
        ultimaFechaModificacion: this.proyectoForm.value.fechaCreacion,
        usuarios: this.proyecto.integrantes.map((integrante: any) => ({ id: integrante.id }))
      }
      this.proyectService.createProyecto(newProyecto, token).subscribe({
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
      console.error('Algo ocurrió con el token o el formulario no es válido');
    }
  }

  // Navegar a la vista de proyectos
  irAAdminDashProyectos() {
    this.router.navigate(['/proyectos']);
  }

  // Variables para controlar los estados de los modales
  isModalBorrarUserOpen = false;
  isModalBorrarTareaOpen = false;
  isModalNuevoUserOpen = false;
  isModalConfirmarBorrarTareaOpen = false;
  isModalCerrar = false;

  // Métodos para abrir y cerrar los modales
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

  // Ocultar un elemento por ID
  ocultarElemento(id: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.style.display = 'none';
    } else {
      console.error('Elemento no encontrado con ID:', id);
    }
  }

  // Mostrar el modal de confirmación de modificación de proyecto
  confirmarModProyecto() {
    const elemento = document.getElementById('id03');
    if (elemento) {
      elemento.style.display = 'block';
    }
  }

  // Buscar el ID del usuario por su email
  buscarIdUsuario(): void {
    if (this.usuario.email) {
      const usuario = this.usuarios.find(u => u.email === this.usuario.email);
      if (usuario) {
        this.usuario.id = usuario.id
      } 
    } 
  }

  // Abrir el modal para agregar un nuevo integrante
  agregarIntegrante(): void {
    this.openNuevoUser();
  }

  // Obtener la fecha actual en formato 'YYYY-MM-DD'
  getFechaActual(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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
        this.closeNuevoUser();
        this.proyecto.integrantes.push(nuevoUsuario);
      }
    } else {
      this.closeNuevoUser();
    }
  }

  // Confirmar el borrado de un usuario del proyecto
  borrarUsuarioConfirmado(): void {
    const usuarioActual = this.usuarioBorradoID === this.usuarioActual.id;
    if (usuarioActual) {
      this.mostrarNotificacion('No puede borrar a este usuario del proyecto');
    } else {
      if (this.usuarioBorradoID) {
        this.proyecto.integrantes = this.proyecto.integrantes.filter(
          integrante => integrante.id !== this.usuarioBorradoID
        );
      }
    }
  }

  // Preparar el modal para confirmar el borrado de un usuario
  confirmarborrarUsuario(id: number, nombre: any, email: any) {
    this.usuarioBorradoID = id;
    this.usuarioBorradoNombre = nombre;
    this.usuarioBorradoEmail = email;
    this.openBorrarUser();
  }

  // Mostrar una notificación con un mensaje específico
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

  // Agregar una nueva tarea y navegar a la vista de tareas
  agregarTarea() {
    this.modificarProyecto2();
    this.router.navigate(['tareas'], { relativeTo: this.route });
  }

  // Modificar el proyecto (llamado al agregar una nueva tarea)
  modificarProyecto2(): void {
    const token = localStorage.getItem('token');
    if (token && this.proyectoForm.valid) {
      const newProyecto = {
        nombre: this.proyectoForm.value.titulo,
        descripcion: this.proyectoForm.value.descripcion,
        fechaCreacion: this.proyectoForm.value.fechaCreacion,
        ultimaFechaModificacion: this.proyectoForm.value.fechaCreacion,
        usuarios: this.proyecto.integrantes.map((integrante: any) => ({ id: integrante.id }))
      }
      this.proyectService.createProyecto(newProyecto, token).subscribe({
        next: () => {
        },
        error: (error: any) => {
          console.error('Error al guardar el proyecto', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token o el formulario no es válido');
    }
  }
}
