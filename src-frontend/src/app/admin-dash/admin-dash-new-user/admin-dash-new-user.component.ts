import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-dash-new-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-dash-new-user.component.html',
  styleUrl: './admin-dash-new-user.component.css'
})
export class AdminDashNewUserComponent implements OnInit {
  userForm: FormGroup;

  isModalOpen = false;
  isModalCerrar = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserServiceService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      apellidos: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^(?=.*\d)[A-Za-z\d]{5,}$/)]],
      confirmarContrasena: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  crearUsuario(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const user = this.userForm.value;
      delete user.confirmarContrasena; // Remove confirm password field
      this.userService.createUser(user, token).subscribe({
        next: () => {
          this.openModalCerrar();
        },
        error: (error) => {
          console.error('Error al guardar al usuario', error);
        },
        complete: () => {
          console.log('Petición para crear el usuario completada');
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  irAAdminDashUsuarios() {
    this.router.navigate(['/adminDash/usuarios']);
  }

  openModalCerrar() {
    this.isModalCerrar = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmarContrasena')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
}
