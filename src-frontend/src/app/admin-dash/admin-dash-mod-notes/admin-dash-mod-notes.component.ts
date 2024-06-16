import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-admin-dash-mod-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './admin-dash-mod-notes.component.html',
  styleUrl: './admin-dash-mod-notes.component.css'
})
export class AdminDashModNotesComponent implements OnInit {
  notaForm: FormGroup;
  usuarios: any[] = [];
  blacklistedWords = ['jolines', 'joder'];

  usuario = {
    email: '',
    id: '',
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private noteService: NoteService
  ) {
    this.notaForm = this.fb.group({
      titulo: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      contenido: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      email: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getNote();
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

  getNote(): void {
    const noteID = Number(this.route.snapshot.paramMap.get('id'));
    const token = localStorage.getItem('token');
    if (token) {
      this.noteService.getNota(noteID, token).subscribe({
        next: (data: any) => {
          this.notaForm.patchValue({
            titulo: data.titulo,
            contenido: data.contenido,
            email: data.usuario.email
          });
        },
        error: (error: any) => {
          console.error('Error al cargar la nota', error);
        },
        complete: () => {
          console.log('Petición para obtener la nota completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  modificarNota(): void {
    this.buscarIdUsuario();
    if (this.notaForm.valid) {
      const token = localStorage.getItem('token');
      const newNote = {
        id: this.route.snapshot.paramMap.get('id'),
        titulo: this.notaForm.value.titulo,
        contenido: this.notaForm.value.contenido,
        usuario: {
          id: this.usuario.id
        }
      };
      console.log(newNote)
      if (token) {
        this.noteService.modNota(newNote, token).subscribe({
          next: () => {
            this.openModalCerrar();
          },
          error: (error: any) => {
            console.error('Error al guardar la nota', error);
          },
          complete: () => {
            console.log('Petición para modificar la nota completada');
          }
        });
      } else {
        console.error('Algo ocurrió con el token');
      }
    }
  }

  irAAdminDashNotas() {
    this.router.navigate(['/adminDash/notas']);
  }

  isModalCerrar = false;

  openModalCerrar() {
    this.isModalCerrar = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
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

  mostrarIdUsuario(email: string): void {
    const usuarioSeleccionado = this.usuarios.find(usuario => usuario.email === email);
    if (usuarioSeleccionado) {
      console.log('ID del usuario seleccionado:', usuarioSeleccionado.id);
    }
  }

  buscarIdUsuario(): void {
  console.log(this.notaForm.value.email)
    if (this.notaForm.value.email) {
      const usuario = this.usuarios.find(u => u.email === this.notaForm.value.email);
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
}
