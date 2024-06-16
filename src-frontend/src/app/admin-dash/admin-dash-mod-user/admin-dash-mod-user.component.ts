// Importaciones necesarias de Angular y otros módulos
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Decorador @Component para definir metadatos del componente
@Component({
  selector: 'app-admin-dash-mod-user', // Selector del componente
  standalone: true, // Indicador de que el componente es autónomo
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink], // Módulos y componentes importados
  templateUrl: './admin-dash-mod-user.component.html', // Ruta al archivo de plantilla HTML
  styleUrl: './admin-dash-mod-user.component.css' // Ruta al archivo de estilos CSS
})
export class AdminDashModUserComponent implements OnInit {
  // Declaración del formulario de usuario
  userForm: FormGroup;

  // Variables para controlar la visibilidad de los modales
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
      id: [''],
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      apellidos: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: [{ value: '', disabled: true }],
      contrasena: ['', [Validators.minLength(5), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/)]],
      confirmContrasena: ['']
    }, { validator: this.passwordMatchValidator });
  }

  // Validador personalizado para verificar que las contraseñas coinciden
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmContrasena')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.getUser(); // Obtener los datos del usuario a modificar
  }

  // Método para obtener los datos del usuario a modificar
  getUser(): void {
    const userID = Number(this.route.snapshot.paramMap.get('id')); // Obtener el ID del usuario de los parámetros de la ruta
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      this.userService.getUser(userID, token).subscribe({
        next: (data: any) => {
          // Asignar los datos del usuario a los campos del formulario
          this.userForm.patchValue({
            id: data.id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            email: data.email
          });
        },
        error: (error) => {
          console.error('Error al cargar al usuario', error); // Manejar errores
        },
        complete: () => {
        }
      });
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Método para modificar el usuario
  modificarUsuario(): void {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
    if (token) {
      if (this.userForm.value.contrasena) {
        // Si se ha ingresado una nueva contraseña
        const userSiP = {
          id: this.userForm.value.id,
          nombre: this.userForm.value.nombre,
          apellidos: this.userForm.value.apellidos,
          email: this.userForm.value.email,
          contrasena: this.userForm.value.contrasena
        };
        this.userService.modUser(userSiP, token).subscribe({
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
        // Si no se ha ingresado una nueva contraseña
        const { contrasena, confirmarContrasena, ...userNoP } = this.userForm.value;
        this.userService.modUser(userNoP, token).subscribe({
          next: () => {
            this.openModalCerrar(); // Abrir el modal de confirmación de éxito
          },
          error: (error) => {
            console.error('Error al guardar al usuario', error); // Manejar errores
          },
          complete: () => {
          }
        });
      }
    } else {
      console.error('Algo ocurrió con el token');
    }
  }

  // Método para navegar de vuelta a la lista de usuarios del administrador
  irAAdminDashUsuarios() {
    this.router.navigate(['/adminDash/usuarios']);
  }

  // Métodos para abrir y cerrar el modal de acción satisfactoria
  openModalCerrar() {
    this.isModalCerrar = true;
  }

  closeModalCerrar() {
    this.isModalCerrar = false;
  }
}
