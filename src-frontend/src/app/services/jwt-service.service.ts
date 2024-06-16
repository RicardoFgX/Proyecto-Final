import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: "root" })
export class JwtService {
  /**
   * Método para obtener el token JWT almacenado en el localStorage
   * @returns El token JWT como una cadena de texto
   */
  getToken(): string {
    // Devuelve el token almacenado en localStorage bajo la clave "token"
    return window.localStorage["token"];
  }

  /**
   * Método para guardar el token JWT en el localStorage
   * @param token - El token JWT que se va a almacenar
   */
  saveToken(token: string): void {
    // Almacena el token en localStorage bajo la clave "token"
    window.localStorage["token"] = token;
  }

  /**
   * Método para eliminar el token JWT del localStorage
   */
  destroyToken(): void {
    // Elimina el token del localStorage bajo la clave "token"
    window.localStorage.removeItem("token");
  } 

  /**
   * Método para decodificar el token JWT almacenado en el localStorage
   * @param token - El token JWT que se va a decodificar
   * @returns El token decodificado
   */
  decodeToken(token: string) {
    // Decodifica el token utilizando la biblioteca jwtDecode y lo almacena en localStorage
    return jwtDecode(window.localStorage["token"] = token);
  }
}
