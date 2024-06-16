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
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.validation.BindingResult;
import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.Map;

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
     * @param result  Contenedor de los resultados de validación.
     * @return ResponseEntity que contiene la respuesta de autenticación con el token JWT.
     */
    @PostMapping("/signup")
    @Operation(summary = "Registrar un nuevo usuario", description = "Registra un nuevo usuario y devuelve un token JWT")
    public ResponseEntity<?> signup(@Valid @RequestBody RegistroRequest request, BindingResult result) {
        if (result.hasErrors()) {
            return handleValidationErrors(result);
        }
        try {
            JwtAuthenticationResponse response = authenticationService.signup(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Manejar el error de correo ya registrado y devolver un mensaje adecuado
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "El correo ya está registrado.");
            return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
        }
    }

    /**
     * Inicia sesión para un usuario existente en el sistema.
     *
     * @param request Datos de inicio de sesión del usuario.
     * @param result  Contenedor de los resultados de validación.
     * @return ResponseEntity que contiene la respuesta de autenticación con el token JWT.
     */
    @PostMapping("/signin")
    @Operation(summary = "Iniciar sesión", description = "Inicia sesión para un usuario existente y devuelve un token JWT")
    public ResponseEntity<?> signin(@Valid @RequestBody LoginRequest request, BindingResult result) {
        if (result.hasErrors()) {
            return handleValidationErrors(result);
        }
        try {
            JwtAuthenticationResponse response = authenticationService.signin(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Manejar el error de credenciales incorrectas y devolver un mensaje adecuado
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "El correo o la contraseña son incorrectos.");
            return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
        }
    }

    /**
     * Maneja los errores de validación y devuelve una respuesta adecuada.
     *
     * @param result Contenedor de los resultados de validación.
     * @return ResponseEntity que contiene los errores de validación.
     */
    private ResponseEntity<Map<String, String>> handleValidationErrors(BindingResult result) {
        Map<String, String> errors = new HashMap<>();
        result.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}
