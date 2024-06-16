import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  //private apiUrl = 'http://localhost:8080/api';
  private apiUrl = 'http://3.232.80.139:8080/api';

  constructor(private http: HttpClient) { }

  /**
   * Método para obtener una tarea específica
   * @param id - El ID de la tarea
   * @param token - El token JWT para autenticación
   * @returns Un Observable con los datos de la tarea
   */
  getTarea(id: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.get<any[]>(`${this.apiUrl}/tareas/${id}`, { headers });
  }

  /**
   * Método para modificar una tarea específica
   * @param tarea - El objeto de la tarea con los datos actualizados
   * @param token - El token JWT para autenticación
   * @returns Un Observable con el resultado de la operación
   */
  modTarea(tarea: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.put<any[]>(`${this.apiUrl}/tareas/${tarea.id}`, tarea, { headers });
  }

  /**
   * Método para crear una nueva tarea
   * @param tarea - El objeto de la tarea a crear
   * @param token - El token JWT para autenticación
   * @returns Un Observable con el resultado de la operación
   */
  createTarea(tarea: any, token: string): Observable<any[]> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Hacer la solicitud HTTP con el encabezado de autenticación y las cabeceras CORS
    return this.http.post<any[]>(`${this.apiUrl}/tareas`, tarea, { headers });
  }

  /**
   * Método para borrar una tarea específica
   * @param tareaId - El ID de la tarea a borrar
   * @param token - El token JWT para autenticación
   * @returns Un Observable con el resultado de la operación
   */
  deleteTarea(tareaId: string, token: string): Observable<any> {
    // Agregar el token de autenticación al encabezado de la solicitud
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Configurar las cabeceras CORS para permitir solicitudes desde el origen de tu aplicación Angular
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Realizar la solicitud HTTP DELETE para borrar la tarea
    return this.http.delete<any>(`${this.apiUrl}/tareas/${tareaId}`, { headers });
  }
}
