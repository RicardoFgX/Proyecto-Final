import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  //private apiUrl = 'http://localhost:8080/api';
  private apiUrl = 'http://3.232.80.139:8080/api';
  
  constructor(private http: HttpClient) { }

  /**
   * Método para obtener todos los usuarios
   * @param token - El token JWT para autenticación
   * @returns Un Observable con los datos de todos los usuarios
   */
  getAllUsers(token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, { headers });
  }

  /**
   * Método para obtener un usuario específico por su ID
   * @param id - El ID del usuario
   * @param token - El token JWT para autenticación
   * @returns Un Observable con los datos del usuario
   */
  getUser(id: number, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/${id}`, { headers });
  }

  /**
   * Método para obtener un usuario específico por su correo electrónico
   * @param email - El correo electrónico del usuario
   * @param token - El token JWT para autenticación
   * @returns Un Observable con los datos del usuario
   */
  getUserEmail(email: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.post<any[]>(`${this.apiUrl}/usuarios/email`, email, { headers });
  }

  /**
   * Método para obtener los proyectos de un usuario específico por su ID
   * @param id - El ID del usuario
   * @param token - El token JWT para autenticación
   * @returns Un Observable con los datos de los proyectos del usuario
   */
  getUserProyects(id: number, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/${id}/proyectos`, { headers });
  }

  /**
   * Método para modificar un usuario específico
   * @param user - El objeto del usuario con los datos actualizados
   * @param token - El token JWT para autenticación
   * @returns Un Observable con el resultado de la operación
   */
  modUser(user: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.put<any[]>(`${this.apiUrl}/usuarios/${user.id}`, user, { headers });
  }

  /**
   * Método para crear un nuevo usuario
   * @param user - El objeto del usuario a crear
   * @param token - El token JWT para autenticación
   * @returns Un Observable con el resultado de la operación
   */
  createUser(user: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.post<any[]>(`${this.apiUrl}/usuarios`, user, { headers });
  }

  /**
   * Método para borrar un usuario específico
   * @param id - El ID del usuario a borrar
   * @param token - El token JWT para autenticación
   * @returns Un Observable con el resultado de la operación
   */
  borrarUsuario(id: number, token: string): Observable<any> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Realizar la solicitud HTTP DELETE para borrar el usuario
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}`, { headers });
  }
}
