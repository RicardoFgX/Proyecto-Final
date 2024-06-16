package com.daw2.proyectoFinal.controller;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daw2.proyectoFinal.model.Anotacion;
import com.daw2.proyectoFinal.model.Usuario;
import com.daw2.proyectoFinal.services.AnotacionService;
import com.daw2.proyectoFinal.services.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@CrossOrigin(origins = {"http://mi-app-angular.s3-website-us-east-1.amazonaws.com", "http://localhost:4200"})
@RestController
@RequestMapping("/api/anotaciones")
@Tag(name = "Anotaciones", description = "API para la gestión de anotaciones. Nota: se necesita enviar un token de login para realizar cualquier acción")
public class AnotacionController {

    @Autowired
    private AnotacionService anotacionService;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Endpoint para obtener todas las anotaciones.
     *
     * @return ResponseEntity con la lista de todas las anotaciones.
     */
    @GetMapping
    @Operation(summary = "Obtener todas las anotaciones", description = "Devuelve una lista de todas las anotaciones")
    public ResponseEntity<List<Anotacion>> obtenerTodasLasAnotaciones() {
        List<Anotacion> anotaciones = anotacionService.obtenerTodasLasAnotaciones();
        return new ResponseEntity<>(anotaciones, HttpStatus.OK);
    }

    /**
     * Endpoint para obtener una anotación por ID.
     *
     * @param id ID de la anotación.
     * @return ResponseEntity con la anotación encontrada o NOT_FOUND si no existe.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener una anotación por ID", description = "Devuelve una anotación basada en su ID")
    public ResponseEntity<?> obtenerAnotacionPorId(@PathVariable Long id) {
        Anotacion anotacion = anotacionService.obtenerAnotacionPorId(id);
        if (anotacion != null) {
            return new ResponseEntity<>(anotacion, HttpStatus.OK);
        } else {
            return crearErrorResponse("Anotación no encontrada.", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Endpoint para obtener anotaciones por ID de usuario.
     *
     * @param usuarioId ID del usuario.
     * @return ResponseEntity con la lista de anotaciones del usuario o un mensaje indicando que no se encontraron anotaciones.
     */
    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Obtener anotaciones por ID de usuario", description = "Devuelve una lista de anotaciones para un usuario específico")
    public ResponseEntity<?> obtenerAnotacionesPorUsuario(@PathVariable Long usuarioId) {
        List<Anotacion> anotaciones = anotacionService.obtenerAnotacionesDeUsuario(usuarioId);
        if (!anotaciones.isEmpty()) {
            return new ResponseEntity<>(anotaciones, HttpStatus.OK);
        } else {
            return crearErrorResponse("No se encontraron anotaciones.", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Endpoint para crear una nueva anotación.
     *
     * @param anotacion Objeto anotación a crear.
     * @param result Contenedor de los resultados de validación.
     * @return ResponseEntity con la anotación creada.
     */
    @PostMapping
    @Operation(summary = "Crear una nueva anotación", description = "Crea una nueva anotación y la devuelve")
    public ResponseEntity<?> crearAnotacion(@Valid @RequestBody Anotacion anotacion, BindingResult result) {
        if (result.hasErrors()) {
            return handleValidationErrors(result);
        }
        // Verificar si el usuario existe
        Usuario usuario = usuarioService.obtenerUsuarioPorId(anotacion.getUsuario().getId());
        if (usuario == null) {
            return crearErrorResponse("Usuario no encontrado.", HttpStatus.NOT_FOUND);
        }
        Anotacion nuevaAnotacion = anotacionService.crearAnotacion(anotacion);
        return new ResponseEntity<>(nuevaAnotacion, HttpStatus.CREATED);
    }

    /**
     * Endpoint para actualizar una anotación existente.
     *
     * @param id ID de la anotación a actualizar.
     * @param anotacionActualizada Objeto anotación con los datos actualizados.
     * @param result Contenedor de los resultados de validación.
     * @return ResponseEntity con la anotación actualizada o NOT_FOUND si no existe.
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una anotación", description = "Actualiza una anotación existente basada en su ID")
    public ResponseEntity<?> actualizarAnotacion(@PathVariable Long id, @Valid @RequestBody Anotacion anotacionActualizada, BindingResult result) {
        if (result.hasErrors()) {
            return handleValidationErrors(result);
        }
        Anotacion anotacion = anotacionService.obtenerAnotacionPorId(id);
        if (anotacion != null) {
            // Verificar si el usuario existe
            Usuario usuario = usuarioService.obtenerUsuarioPorId(anotacionActualizada.getUsuario().getId());
            if (usuario == null) {
                return crearErrorResponse("Usuario no encontrado.", HttpStatus.NOT_FOUND);
            }
            anotacionActualizada.setId(id);
            Anotacion anotacionActualizadaDb = anotacionService.actualizarAnotacion(anotacionActualizada);
            return new ResponseEntity<>(anotacionActualizadaDb, HttpStatus.OK);
        } else {
            return crearErrorResponse("Anotación no encontrada.", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Endpoint para eliminar una anotación por ID.
     *
     * @param id ID de la anotación a eliminar.
     * @return ResponseEntity con el estado de la operación.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una anotación", description = "Elimina una anotación basada en su ID")
    public ResponseEntity<?> eliminarAnotacion(@PathVariable Long id) {
        boolean eliminado = anotacionService.eliminarAnotacion(id);
        if (eliminado) {
			return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return crearErrorResponse("Anotación no encontrada.", HttpStatus.NOT_FOUND);
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

    /**
     * Crea una respuesta de error personalizada.
     *
     * @param message Mensaje de error.
     * @param status Estado HTTP.
     * @return ResponseEntity con el mensaje de error y el estado HTTP.
     */
    private ResponseEntity<Map<String, String>> crearErrorResponse(String message, HttpStatus status) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", message);
        return new ResponseEntity<>(errorResponse, status);
    }
}
