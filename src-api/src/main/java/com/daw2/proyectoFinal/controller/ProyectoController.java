package com.daw2.proyectoFinal.controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daw2.proyectoFinal.model.Proyecto;
import com.daw2.proyectoFinal.services.ProyectoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@CrossOrigin(origins = {"http://mi-app-angular.s3-website-us-east-1.amazonaws.com", "http://localhost:4200"})
@RestController
@RequestMapping("/api/proyectos")
@Tag(name = "Proyectos", description = "API para la gestión de proyectos. API para la gestión de anotaciones. Nota: se necesita enviar un token de login para realizar cualquier acción")
public class ProyectoController {

    @Autowired
    private ProyectoService proyectoService;

    /**
     * Endpoint para obtener todos los proyectos.
     *
     * @return ResponseEntity con la lista de todos los proyectos.
     */
    @GetMapping
    @Operation(summary = "Obtener todos los proyectos", description = "Devuelve una lista de todos los proyectos")
    public ResponseEntity<List<Proyecto>> obtenerTodosLosProyectos() {
        List<Proyecto> proyectos = proyectoService.obtenerTodosLosProyectos();
        return new ResponseEntity<>(proyectos, HttpStatus.OK);
    }

    /**
     * Endpoint para obtener un proyecto por ID.
     *
     * @param id ID del proyecto.
     * @return ResponseEntity con el proyecto encontrado o NOT_FOUND si no existe.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener un proyecto por ID", description = "Devuelve un proyecto basado en su ID")
    public ResponseEntity<?> obtenerProyectoPorId(@PathVariable Long id) {
        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        if (proyecto != null) {
            return new ResponseEntity<>(proyecto, HttpStatus.OK);
        } else {
            return crearErrorResponse("Proyecto no encontrado.", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Endpoint para crear un nuevo proyecto.
     *
     * @param proyecto Objeto proyecto a crear.
     * @param result Contenedor de los resultados de validación.
     * @return ResponseEntity con el proyecto creado.
     */
    @PostMapping
    @Operation(summary = "Crear un nuevo proyecto", description = "Crea un nuevo proyecto y lo devuelve")
    public ResponseEntity<?> crearProyecto(@Valid @RequestBody Proyecto proyecto, BindingResult result) {
        if (result.hasErrors()) {
            return handleValidationErrors(result);
        }
        Proyecto nuevoProyecto = proyectoService.crearProyecto(proyecto);
        return new ResponseEntity<>(nuevoProyecto, HttpStatus.CREATED);
    }

    /**
     * Endpoint para actualizar un proyecto existente.
     *
     * @param id ID del proyecto a actualizar.
     * @param proyectoActualizado Objeto proyecto con los datos actualizados.
     * @param result Contenedor de los resultados de validación.
     * @return ResponseEntity con el proyecto actualizado o NOT_FOUND si no existe.
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un proyecto", description = "Actualiza un proyecto existente basado en su ID")
    public ResponseEntity<?> actualizarProyecto(@PathVariable Long id, @Valid @RequestBody Proyecto proyectoActualizado, BindingResult result) {
        if (result.hasErrors()) {
            return handleValidationErrors(result);
        }
        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        if (proyecto != null) {
            proyectoActualizado.setId(id);
            Proyecto proyectoActualizadoDb = proyectoService.actualizarProyecto(proyectoActualizado);
            return new ResponseEntity<>(proyectoActualizadoDb, HttpStatus.OK);
        } else {
            return crearErrorResponse("Proyecto no encontrado.", HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * Endpoint para actualizar parcialmente un proyecto existente.
     *
     * @param id ID del proyecto a actualizar.
     * @param proyectoActualizado Objeto proyecto con los datos parcialmente actualizados.
     * @return ResponseEntity con el proyecto actualizado o NOT_FOUND si no existe.
     */
    @PatchMapping("/{id}")
    @Operation(summary = "Actualizar parcialmente un proyecto", description = "Actualiza parcialmente un proyecto existente basado en su ID")
    public ResponseEntity<?> actualizarParcialProyecto(@PathVariable Long id, @RequestBody Proyecto proyectoActualizado) {
        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        if (proyecto != null) {
            proyectoActualizado.setId(id);
            Proyecto proyectoActualizadoDb = proyectoService.actualizarProyecto(proyectoActualizado);
            return new ResponseEntity<>(proyectoActualizadoDb, HttpStatus.OK);
        } else {
            return crearErrorResponse("Proyecto no encontrado.", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Endpoint para eliminar un proyecto por ID.
     *
     * @param id ID del proyecto a eliminar.
     * @return ResponseEntity con el estado de la operación.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un proyecto", description = "Elimina un proyecto basado en su ID")
    public ResponseEntity<?> eliminarProyecto(@PathVariable Long id) {
        boolean eliminado = proyectoService.eliminarProyecto(id);
        if (eliminado) {
			return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return crearErrorResponse("Proyecto no encontrado.", HttpStatus.NOT_FOUND);
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
