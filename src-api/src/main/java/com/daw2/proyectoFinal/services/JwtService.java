package com.daw2.proyectoFinal.services;

import org.springframework.security.core.userdetails.UserDetails;

/**
 * Interfaz que define los métodos para el servicio de manejo de tokens JWT.
 */
public interface JwtService {

    /**
     * Extrae el nombre de usuario desde un token JWT.
     *
     * @param token El token JWT.
     * @return El nombre de usuario extraído del token.
     */
    String extractUserName(String token);

    /**
     * Genera un token JWT basado en los detalles del usuario.
     *
     * @param userDetails Los detalles del usuario.
     * @return El token JWT generado.
     */
    String generateToken(UserDetails userDetails);

    /**
     * Verifica si un token JWT es válido para los detalles del usuario proporcionados.
     *
     * @param token       El token JWT a verificar.
     * @param userDetails Los detalles del usuario.
     * @return Verdadero si el token es válido, falso en caso contrario.
     */
    boolean isTokenValid(String token, UserDetails userDetails);
}
