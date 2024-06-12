import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiUrl = 'http://localhost:8080/api'; // Reemplaza con la URL de tu API de usuarios

  constructor(private http: HttpClient) { }

  getAllUsers(token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, { headers });
  }

  getUser(id: number, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/${id}`, { headers });
  }

  getUserEmail(email: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.post<any[]>(`${this.apiUrl}/usuarios/email`, email, { headers });
  }

  getUserProyects(id:number, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/${id}/proyectos`, { headers });
  }

  modUser(user: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.put<any[]>(`${this.apiUrl}/usuarios/${user.id}`, user, { headers });
  }

  createUser(user: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.post<any[]>(`${this.apiUrl}/usuarios`, user, { headers });
  }

  borrarUsuario(id: number, token: string): Observable<any> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');
  
    // Realizar la solicitud HTTP DELETE para borrar el usuario
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}`, { headers });
  }
  
}
