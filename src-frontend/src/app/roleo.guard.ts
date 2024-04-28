import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from './services/jwt-service.service';

export const roleoGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const token = jwtService.getToken();
    if (token) {
      const decodedToken: any = jwtService.decodeToken(token);
      const expectedRole = 'ADMINISTRADOR'; // Define el rol esperado
      console.log(decodedToken.role[0].authority)

      // Comprueba si el usuario tiene el rol adecuado
      if (decodedToken && decodedToken.role[0].authority === expectedRole) {
        return true; // Permitir acceso a la ruta si el usuario tiene el rol adecuado
      }
    }
    
    // Si el usuario no tiene el rol adecuado o no hay token, redirigir a la página de inicio
    window.location.href = '/home';
    return false;
};

export const userGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const token = jwtService.getToken();
    if (token) {
        return true; // Permitir acceso a la ruta si el usuario tiene el rol adecuado
    }
    
    // Si el usuario no tiene el rol adecuado o no hay token, redirigir a la página de inicio
    window.location.href = '/login';
    return false;
};
