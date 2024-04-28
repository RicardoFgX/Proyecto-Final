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

  register(credentials: { nombre: string, email: string, contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, credentials);
  }
}

