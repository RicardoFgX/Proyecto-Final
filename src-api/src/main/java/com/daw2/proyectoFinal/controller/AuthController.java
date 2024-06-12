package com.daw2.proyectoFinal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daw2.proyectoFinal.dtos.request.LoginRequest;
import com.daw2.proyectoFinal.dtos.request.RegistroRequest;
import com.daw2.proyectoFinal.dtos.response.JwtAuthenticationResponse;
import com.daw2.proyectoFinal.services.AuthenticationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * Controlador REST que gestiona las operaciones de autenticación y registro de usuarios.
 * Proporciona endpoints para registrar nuevos usuarios y para iniciar sesión.
 */
@CrossOrigin(origins = {"http://mi-app-angular.s3-website-us-east-1.amazonaws.com", "http://localhost:4200"})
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "API para la autenticación y registro de usuarios")
public class AuthController {

    /**
     * Inyección del servicio de autenticación.
     */
    @Autowired
    private AuthenticationService authenticationService;

    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param request Datos de registro del nuevo usuario.
     * @return ResponseEntity que contiene la respuesta de autenticación con el token JWT.
     */
    @PostMapping("/signup")
    @Operation(summary = "Registrar un nuevo usuario", description = "Registra un nuevo usuario y devuelve un token JWT")
    public ResponseEntity<JwtAuthenticationResponse> signup(@RequestBody RegistroRequest request) {
        JwtAuthenticationResponse response = authenticationService.signup(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Inicia sesión para un usuario existente en el sistema.
     *
     * @param request Datos de inicio de sesión del usuario.
     * @return ResponseEntity que contiene la respuesta de autenticación con el token JWT.
     */
    @PostMapping("/signin")
    @Operation(summary = "Iniciar sesión", description = "Inicia sesión para un usuario existente y devuelve un token JWT")
    public ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody LoginRequest request) {
        JwtAuthenticationResponse response = authenticationService.signin(request);
        return ResponseEntity.ok(response);
    }
}
