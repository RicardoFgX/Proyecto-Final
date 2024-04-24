import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth'; // Cambia esto si tu API está en otro puerto o dominio

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, credentials);
  }

  register(nombre: string, apellidos: string, email: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { nombre, apellidos, email, contrasena });
  }
}
