import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-dash-mod-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-dash-mod-user.component.html',
  styleUrl: './admin-dash-mod-user.component.css'
})
export class AdminDashModUserComponent implements OnInit {
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
      id: [''],
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      apellidos: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: [{ value: '', disabled: true }],
      contrasena: ['', [Validators.minLength(5), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/)]],
      confirmContrasena: ['']
    }, { validator: this.passwordMatchValidator });
  }
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmContrasena')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const userID = Number(this.route.snapshot.paramMap.get('id'));
    console.log(userID);
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUser(userID, token).subscribe({
        next: (data: any) => {
          this.userForm.patchValue({
            id: data.id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            email: data.email
          });
          console.log(data);
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

  modificarUsuario(): void {
    const token = localStorage.getItem('token');
    if (token) {
      if (this.userForm.value.contrasena) {
        console.log("NuevaContra");
        const userSiP = {
          id: this.userForm.value.id,
          nombre: this.userForm.value.nombre,
          apellidos: this.userForm.value.apellidos,
          email: this.userForm.value.email,
          contrasena: this.userForm.value.contrasena
        }
        console.log(userSiP);
        this.userService.modUser(userSiP, token).subscribe({
          next: () => {
            this.openModalCerrar();
          },
          error: (error) => {
            console.error('Error al guardar al usuario', error);
          },
          complete: () => {
            console.log('Petición para modificar el usuario completada');
          }
        });
      } else {
        console.log("sin contra");
        const { contrasena, confirmarContrasena, ...userNoP } = this.userForm.value;
        this.userService.modUser(userNoP, token).subscribe({
          next: () => {
            this.openModalCerrar();
          },
          error: (error) => {
            console.error('Error al guardar al usuario', error);
          },
          complete: () => {
            console.log('Petición para modificar el usuario completada'); 
          }
        });
      }
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
}
