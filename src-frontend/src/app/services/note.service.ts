import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  //private apiUrl = 'http://localhost:8080/api';
  private apiUrl = 'http://3.232.80.139:8080/api';

  constructor(private http: HttpClient) { }

  /**
   * Método para obtener todas las notas
   * @param token - El token JWT para autenticación
   * @returns Un Observable con la lista de notas
   */
  getAllNotes(token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Hacer la solicitud HTTP con el encabezado de autenticación
    return this.http.get<any[]>(`${this.apiUrl}/anotaciones`, { headers });
  }

  /**
   * Método para obtener todas las notas de un usuario específico
   * @param id - El ID del usuario
   * @param token - El token JWT para autenticación
   * @returns Un Observable con la lista de notas del usuario
   */
  getAllNotesUser(id: number, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Hacer la solicitud HTTP con el encabezado de autenticación
    return this.http.get<any[]>(`${this.apiUrl}/anotaciones/usuario/${id}`, { headers });
  }

  /**
   * Método para borrar una nota específica
   * @param id - El ID de la nota a borrar
   * @param token - El token JWT para autenticación
   * @returns Un Observable con el resultado de la operación
   */
  borrarNota(id: number, token: string): Observable<any> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Realizar la solicitud HTTP DELETE para borrar la nota
    return this.http.delete<any>(`${this.apiUrl}/anotaciones/${id}`, { headers });
  }

  /**
   * Método para obtener una nota específica
   * @param id - El ID de la nota
   * @param token - El token JWT para autenticación
   * @returns Un Observable con los datos de la nota
   */
  getNota(id: number, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Hacer la solicitud HTTP con el encabezado de autenticación
    return this.http.get<any[]>(`${this.apiUrl}/anotaciones/${id}`, { headers });
  }

  /**
   * Método para modificar una nota específica
   * @param nota - El objeto de la nota a modificar
   * @param token - El token JWT para autenticación
   * @returns Un Observable con el resultado de la operación
   */
  modNota(nota: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Hacer la solicitud HTTP PUT para modificar la nota
    return this.http.put<any[]>(`${this.apiUrl}/anotaciones/${nota.id}`, nota, { headers });
  }

  /**
   * Método para crear una nueva nota
   * @param nota - El objeto de la nota a crear
   * @param token - El token JWT para autenticación
   * @returns Un Observable con el resultado de la operación
   */
  createNota(nota: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Hacer la solicitud HTTP POST para crear la nueva nota
    return this.http.post<any[]>(`${this.apiUrl}/anotaciones`, nota, { headers });
  }
}
