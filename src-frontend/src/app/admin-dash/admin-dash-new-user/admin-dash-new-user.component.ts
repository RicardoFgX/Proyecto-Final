// Importaciones necesarias de Angular y otros módulos
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-dash-new-user', // Selector del componente
  standalone: true, // Indicador de que el componente es autónomo
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink], // Módulos y componentes importados
  templateUrl: './admin-dash-new-user.component.html', // Ruta al archivo de plantilla HTML
  styleUrl: './admin-dash-new-user.component.css' // Ruta al archivo de estilos CSS
})
export class AdminDashNewUserComponent implements OnInit {
  // Declaración del formulario de usuario y los datos relacionados
  userForm: FormGroup;

  // Propiedades para controlar la visibilidad del modal
  isModalOpen = false;
  isModalCerrar = false;

  // Constructor para inyectar servicios y form builder
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserServiceService,
    private router: Router
  ) {
    // Inicialización del formulario con validaciones
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      apellidos: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^(?=.*\d)[A-Za-z\d]{5,}$/)]],
      confirmarContrasena: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
  }

  // Método para crear un nuevo usuario
  crearUsuario(): void {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      const user = this.userForm.value;
      delete user.confirmarContrasena; // Eliminar el campo de confirmación de la contraseña
      this.userService.createUser(user, token).subscribe({
        next: () => {
          this.openModalCerrar(); // Abrir el modal de confirmación de éxito
        },
        error: (error) => {
          console.error('Error al guardar al usuario', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Método para navegar a la vista de usuarios
  irAAdminDashUsuarios() {
    this.router.navigate(['/adminDash/usuarios']);
  }

  // Métodos para abrir y cerrar el modal de confirmación
  openModalCerrar() {
    this.isModalCerrar = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
  }

  // Validador personalizado para verificar que las contraseñas coinciden
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmarContrasena')?.value;
    return password === confirmPassword ? null : { mismatch: true }; // Retornar error si las contraseñas no coinciden
  }
}
