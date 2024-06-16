import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectService {
   //private apiUrl = 'http://localhost:8080/api';
   private apiUrl = 'http://3.232.80.139:8080/api';

  constructor(private http: HttpClient) { }

  /**
   * Método para obtener todos los proyectos
   * @param token - El token JWT para autenticación
   * @returns Un Observable con la lista de proyectos
   */
  getAllProyects(token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Hacer la solicitud HTTP con el encabezado de autenticación
    return this.http.get<any[]>(`${this.apiUrl}/proyectos`, { headers });
  }

  /**
   * Método para borrar un proyecto específico
   * @param id - El ID del proyecto a borrar
   * @param token - El token JWT para autenticación
   * @returns Un Observable con el resultado de la operación
   */
  borrarProyecto(id: number, token: string): Observable<any> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Realizar la solicitud HTTP DELETE para borrar el proyecto
    return this.http.delete<any>(`${this.apiUrl}/proyectos/${id}`, { headers });
  }

  /**
   * Método para obtener un proyecto específico
   * @param id - El ID del proyecto
   * @param token - El token JWT para autenticación
   * @returns Un Observable con los datos del proyecto
   */
  getProyecto(id: number, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Hacer la solicitud HTTP con el encabezado de autenticación
    return this.http.get<any[]>(`${this.apiUrl}/proyectos/${id}`, { headers });
  }

  /**
   * Método para obtener todos los proyectos de un usuario específico por ID de usuario
   * @param id - El ID del usuario
   * @param token - El token JWT para autenticación
   * @returns Un Observable con la lista de proyectos del usuario
   */
  getAllProyectoID(id: number, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Hacer la solicitud HTTP con el encabezado de autenticación
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/${id}/proyectos`, { headers });
  }

  /**
   * Método para modificar un proyecto específico
   * @param id - El ID del proyecto a modificar
   * @param proyecto - El objeto del proyecto con los datos actualizados
   * @param token - El token JWT para autenticación
   * @returns Un Observable con el resultado de la operación
   */
  modProyecto(id: any, proyecto: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Hacer la solicitud HTTP PUT para modificar el proyecto
    return this.http.put<any[]>(`${this.apiUrl}/proyectos/${id}`, proyecto, { headers });
  }

  /**
   * Método para crear un nuevo proyecto
   * @param proyecto - El objeto del proyecto a crear
   * @param token - El token JWT para autenticación
   * @returns Un Observable con el resultado de la operación
   */
  createProyecto(proyecto: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Hacer la solicitud HTTP POST para crear el nuevo proyecto
    return this.http.post<any[]>(`${this.apiUrl}/proyectos`, proyecto, { headers });
  }
}
