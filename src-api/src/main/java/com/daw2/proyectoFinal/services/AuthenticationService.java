package com.daw2.proyectoFinal.services;

import com.daw2.proyectoFinal.dtos.request.LoginRequest;
import com.daw2.proyectoFinal.dtos.request.RegistroRequest;
import com.daw2.proyectoFinal.dtos.response.JwtAuthenticationResponse;

/**
 * Interfaz que define los métodos para la autenticación de usuarios.
 */
public interface AuthenticationService {

    /**
     * Registra a un nuevo usuario y genera una respuesta de autenticación JWT.
     *
     * @param request La información del usuario a registrar.
     * @return La respuesta de autenticación JWT.
     */
    JwtAuthenticationResponse signup(RegistroRequest request);

    /**
     * Autentica a un usuario existente y genera una respuesta de autenticación JWT.
     *
     * @param request La información del usuario para iniciar sesión.
     * @return La respuesta de autenticación JWT.
     */
    JwtAuthenticationResponse signin(LoginRequest request);
}

