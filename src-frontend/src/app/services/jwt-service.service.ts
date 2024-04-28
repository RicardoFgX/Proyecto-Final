import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: "root" })
export class JwtService {
  getToken(): string {
    return window.localStorage["token"];
  }

  saveToken(token: string): void {
    window.localStorage["token"] = token;
  }

  destroyToken(): void {
    window.localStorage.removeItem("token");
  } 

  decodeToken(token: string) {
    return jwtDecode(window.localStorage["token"] = token);
  }
}
