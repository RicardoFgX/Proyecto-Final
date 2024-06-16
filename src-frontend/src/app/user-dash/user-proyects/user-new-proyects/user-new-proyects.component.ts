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
export class UserNewProyectsComponent {
  proyectoForm: FormGroup;

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

  userEmail: string | null = null;
  token: string | null = null;

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
    this.proyectoForm = this.fb.group({
      titulo: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      descripcion: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      fechaCreacion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.proyecto.integrantes.push(this.usuarioActual);
    this.checkAuthStatus();
    this.getUser();
    this.getAllUsers();
    this.ultimaFechaModificacion = this.getFechaActual();
    this.proyectoForm.patchValue({
      fechaCreacion: this.getFechaActual()
    });
  }

  blacklistValidator(blacklist: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const hasBlacklistedWord = blacklist.some(word => control.value.toLowerCase().includes(word.toLowerCase()));
      return hasBlacklistedWord ? { 'blacklisted': true } : null;
    };
  }

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
        }
      });
    } else {
      console.error('No se encontró el token de autenticación.');
    }
  }

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
          console.log('Petición para modificar el proyecto completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token o el formulario no es válido');
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
          console.log('Petición para modificar el proyecto completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token o el formulario no es válido');
    }
  }
}
