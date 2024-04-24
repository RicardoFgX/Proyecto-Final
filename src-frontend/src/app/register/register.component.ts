import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  nombre: string = '';
  apellidos: string = '';

  constructor() {}

  register() {
    console.log(this.email);
    console.log(this.password);
    console.log(this.nombre);
    console.log(this.apellidos);
  }
}

