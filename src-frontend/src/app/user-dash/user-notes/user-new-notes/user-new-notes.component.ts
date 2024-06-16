import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoteService } from '../../../services/note.service';
import { UserServiceService } from '../../../services/user-service.service';
import { jwtDecode } from 'jwt-decode';
import { JwtService } from '../../../services/jwt-service.service';

@Component({
  selector: 'app-user-new-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './user-new-notes.component.html',
  styleUrls: ['./user-new-notes.component.css']
})
export class UserNewNotesComponent implements OnInit {
  notaForm: FormGroup;

  blacklistedWords = [
    'maricón', 'puto', 'joder', 'mierda', 'cabrón', 'cabron', 'bastardo'
  ];

  usuario = {
    email: '',
    id: '',
  };

  emailInicial: string = '';

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

  usuarios: any[] = [];

  userEmail: string | null = null;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private noteService: NoteService,
    private jwtService: JwtService
  ) {
    // Inicialización del formulario con validaciones
    this.notaForm = this.fb.group({
      titulo: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      contenido: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]]
    });
  }

  ngOnInit(): void {
    // Llamar a los métodos necesarios al inicializar el componente
    this.getAllUsers();
    this.checkAuthStatus();
    this.getUser();
  }

  // Validador para palabras no permitidas
  blacklistValidator(blacklist: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const hasBlacklistedWord = blacklist.some(word => control.value.toLowerCase().includes(word.toLowerCase()));
      return hasBlacklistedWord ? { 'blacklisted': true } : null;
    };
  }

  // Verifica el estado de autenticación y obtiene el token
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

  // Obtiene los datos del usuario autenticado
  getUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserEmail(this.emailRequest, token).subscribe({
        next: (data: any) => {
          this.user.id = data.id;
          this.usuario.id = data.id;
          this.user.nombre = data.nombre;
          this.user.apellidos = data.apellidos;
          this.user.email = data.email;
          this.emailInicial = data.email;
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

  // Obtiene la lista de todos los usuarios
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

  // Crea una nueva nota
  crearNota(): void {
    const token = localStorage.getItem('token');
    this.buscarIdUsuario();
    if (this.notaForm.valid && token) {
      const newNote = {
        titulo: this.notaForm.value.titulo,
        contenido: this.notaForm.value.contenido,
        usuario: {
          id: this.usuario.id
        }
      }
      this.noteService.createNota(newNote, token).subscribe({
        next: () => {
          this.openModalCerrar();
        },
        error: (error: any) => {
          console.error('Error al guardar al usuario', error);
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token o el formulario no es válido');
    }
  }

  // Navega de regreso al dashboard de notas
  irAAdminDashNotas() {
    this.router.navigate(['/notas']);
  }

  isModalOpen = false;
  isModalCerrar = false;

  // Abre el modal de confirmación
  openModalCerrar() {
    this.isModalCerrar = true;
  }

  // Cierra el modal de confirmación
  closeModalCerrar() {
    this.isModalCerrar = false;
  }

  // Busca el ID del usuario basado en su email
  buscarIdUsuario(): void {
    if (this.usuario.email) {
      const usuario = this.usuarios.find(u => u.email === this.usuario.email);
      if (usuario) {
        this.usuario.id = usuario.id;
      } 
    } 
  }
}
