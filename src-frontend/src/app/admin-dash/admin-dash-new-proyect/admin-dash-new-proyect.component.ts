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

@Component({
  selector: 'app-admin-dash-new-proyect',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatInputModule, MatIconModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './admin-dash-new-proyect.component.html',
  styleUrl: './admin-dash-new-proyect.component.css'
})
export class AdminDashNewProyectComponent implements OnInit {
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
  blacklistedWords = ['jolines', 'joder'];

  isModalBorrarUserOpen = false;
  isModalBorrarTareaOpen = false;
  isModalNuevoUserOpen = false;
  isModalConfirmarBorrarTareaOpen = false;
  isModalCerrar = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private proyectService: ProyectService,
    private tareaService: TareaService
  ) {
    this.proyectoForm = this.fb.group({
      titulo: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      descripcion: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      fechaCreacion: [''],
      nuevoUsuario: ['']
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.proyectoForm.patchValue({
      fechaCreacion: this.getFechaActual()
    });
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

  crearProyecto(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const newProyecto = {
        nombre: this.proyectoForm.value.titulo,
        descripcion: this.proyectoForm.value.descripcion,
        fechaCreacion: this.proyectoForm.value.fechaCreacion,
        ultimaFechaModificacion: this.proyectoForm.value.fechaCreacion,
        usuarios: this.proyecto.integrantes.map((integrante: any) => ({ id: integrante.id }))
      };
      console.log(newProyecto);
      this.proyectService.createProyecto(newProyecto, token).subscribe({
        next: () => {
          this.openModalCerrar();
        },
        error: (error: any) => {
          console.error('Error al guardar el proyecto', error);
        },
        complete: () => {
          console.log('Petición para crear el proyecto completada'); 
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  irAAdminDashProyectos() {
    this.router.navigate(['/adminDash/proyectos']);
  }

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
    this.crearProyecto();
    this.router.navigate(['tareas'], { relativeTo: this.route });
  }

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
