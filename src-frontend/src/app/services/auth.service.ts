import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL base de la API de autenticación
  //private apiUrl = 'http://localhost:8080/api/auth';
  private apiUrl = 'http://3.232.80.139:8080/api/auth';

  // Constructor que inyecta HttpClient para hacer solicitudes HTTP
  constructor(private http: HttpClient) { }

  /**
   * Método para iniciar sesión
   * @param credentials - Objeto que contiene el email y la contraseña del usuario
   * @returns Observable de la respuesta HTTP
   */
  login(credentials: { email: string, contrasena: string }): Observable<any> {
    // Realiza una solicitud POST a la URL de inicio de sesión de la API con las credenciales del usuario
    return this.http.post(`${this.apiUrl}/signin`, credentials);
  }

  /**
   * Método para registrarse
   * @param credentials - Objeto que contiene el nombre, email y la contraseña del usuario
   * @returns Observable de la respuesta HTTP
   */
  register(credentials: { nombre: string, email: string, contrasena: string }): Observable<any> {
    // Realiza una solicitud POST a la URL de registro de la API con las credenciales del usuario
    return this.http.post(`${this.apiUrl}/signup`, credentials);
  }
}
