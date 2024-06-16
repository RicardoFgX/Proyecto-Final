import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoteService } from '../../../services/note.service';
import { UserServiceService } from '../../../services/user-service.service';

@Component({
  selector: 'app-user-mod-notes',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './user-mod-notes.component.html',
  styleUrls: ['./user-mod-notes.component.css']
})
export class UserModNotesComponent implements OnInit {
  notaForm: FormGroup;

  blacklistedWords = [
    'maricón', 'puto', 'joder', 'mierda', 'cabrón', 'cabron', 'bastardo'
  ];

  usuario = {
    email: '',
    id: '',
  };

  usuarios: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private noteService: NoteService
  ) {
    this.notaForm = this.fb.group({
      titulo: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]],
      contenido: ['', [Validators.required, this.blacklistValidator(this.blacklistedWords)]]
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getNote();
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
            id: data.id,
            titulo: data.titulo,
            contenido: data.contenido,
          });
          this.usuario.email = data.usuario.email;
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
    const token = localStorage.getItem('token');
    this.buscarIdUsuario();
    if (this.notaForm.valid && token) {
      const newNote = {
        id: this.route.snapshot.paramMap.get('id'),
        titulo: this.notaForm.value.titulo,
        contenido: this.notaForm.value.contenido,
        usuario: {
          id: this.usuario.id
        }
      }
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
      console.error('Algo ocurrió con el token o el formulario no es válido');
    }
  }
  
  irAAdminDashUsuarios() {
    this.router.navigate(['/notas']);
  }

  buscarIdUsuario(): void {
    if (this.usuario.email) {
      const usuario = this.usuarios.find(u => u.email === this.usuario.email);
      if (usuario) {
        this.usuario.id = usuario.id;
      } else {
        console.log('Usuario no encontrado');
      }
    } else {
      console.log('No se ha seleccionado ningún correo electrónico');
    }
  }

  isModalCerrar = false;

  openModalCerrar() {
    this.isModalCerrar = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
  }
}
