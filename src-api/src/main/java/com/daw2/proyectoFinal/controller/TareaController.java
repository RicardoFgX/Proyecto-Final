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

import com.daw2.proyectoFinal.model.Tarea;
import com.daw2.proyectoFinal.model.Proyecto;
import com.daw2.proyectoFinal.services.ProyectoService;
import com.daw2.proyectoFinal.services.TareaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@CrossOrigin(origins = {"http://mi-app-angular.s3-website-us-east-1.amazonaws.com", "http://localhost:4200"})
@RestController
@RequestMapping("/api/tareas")
@Tag(name = "Tareas", description = "API para la gestión de tareas. Nota: se necesita enviar un token de login para realizar cualquier acción")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    @Autowired
    private ProyectoService proyectoService;

    /**
     * Endpoint para obtener todas las tareas.
     *
     * @return ResponseEntity con la lista de todas las tareas.
     */
    @GetMapping
    @Operation(summary = "Obtener todas las tareas", description = "Devuelve una lista de todas las tareas")
    public ResponseEntity<List<Tarea>> obtenerTodasLasTareas() {
        List<Tarea> tareas = tareaService.obtenerTodasLasTareas();
        return new ResponseEntity<>(tareas, HttpStatus.OK);
    }

    /**
     * Endpoint para obtener una tarea por ID.
     *
     * @param id ID de la tarea.
     * @return ResponseEntity con la tarea encontrada o NOT_FOUND si no existe.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener una tarea por ID", description = "Devuelve una tarea basada en su ID")
    public ResponseEntity<?> obtenerTareaPorId(@PathVariable Long id) {
        Tarea tarea = tareaService.obtenerTareaPorId(id);
        if (tarea != null) {
            return new ResponseEntity<>(tarea, HttpStatus.OK);
        } else {
            return crearErrorResponse("Tarea no encontrada.", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Endpoint para crear una nueva tarea.
     *
     * @param tarea Objeto tarea a crear.
     * @return ResponseEntity con la tarea creada.
     */
    @PostMapping
    @Operation(summary = "Crear una nueva tarea", description = "Crea una nueva tarea y la devuelve")
    public ResponseEntity<?> crearTarea(@Valid @RequestBody Tarea tarea, BindingResult result) {
        if (result.hasErrors()) {
            return handleValidationErrors(result);
        }
        Proyecto proyecto = proyectoService.obtenerProyectoPorId(tarea.getProyecto().getId());
        if (proyecto == null) {
            return crearErrorResponse("Proyecto no encontrado.", HttpStatus.NOT_FOUND);
        }
        Tarea nuevaTarea = tareaService.crearTarea(tarea);
        return new ResponseEntity<>(nuevaTarea, HttpStatus.CREATED);
    }

    /**
     * Endpoint para actualizar una tarea existente.
     *
     * @param id ID de la tarea a actualizar.
     * @param tareaActualizada Objeto tarea con los datos actualizados.
     * @param result Contenedor de los resultados de validación.
     * @return ResponseEntity con la tarea actualizada o NOT_FOUND si no existe.
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una tarea", description = "Actualiza una tarea existente basada en su ID")
    public ResponseEntity<?> actualizarTarea(@PathVariable Long id, @Valid @RequestBody Tarea tareaActualizada, BindingResult result) {
        if (result.hasErrors()) {
            return handleValidationErrors(result);
        }
        Tarea tarea = tareaService.obtenerTareaPorId(id);
        if (tarea != null) {
            Proyecto proyecto = proyectoService.obtenerProyectoPorId(tareaActualizada.getProyecto().getId());
            if (proyecto == null) {
                return crearErrorResponse("Proyecto no encontrado.", HttpStatus.NOT_FOUND);
            }
            tareaActualizada.setId(id);
            Tarea tareaActualizadaDb = tareaService.actualizarTarea(tareaActualizada);
            return new ResponseEntity<>(tareaActualizadaDb, HttpStatus.OK);
        } else {
            return crearErrorResponse("Tarea no encontrada.", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Endpoint para eliminar una tarea por ID.
     *
     * @param id ID de la tarea a eliminar.
     * @return ResponseEntity con el estado de la operación.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una tarea", description = "Elimina una tarea basada en su ID")
    public ResponseEntity<?> eliminarTarea(@PathVariable Long id) {
        boolean eliminado = tareaService.eliminarTarea(id);
        if (eliminado) {
			return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return crearErrorResponse("Tarea no encontrada.", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Endpoint para obtener tareas por ID de proyecto.
     *
     * @param proyectoId ID del proyecto.
     * @return ResponseEntity con la lista de tareas del proyecto o NOT_FOUND si no tiene tareas.
     */
    @GetMapping("/proyecto/{proyectoId}")
    @Operation(summary = "Obtener tareas por ID de proyecto", description = "Devuelve una lista de tareas para un proyecto específico")
    public ResponseEntity<?> obtenerTareasPorProyecto(@PathVariable Long proyectoId) {
        List<Tarea> tareas = tareaService.obtenerTareasPorProyecto(proyectoId);
        if (!tareas.isEmpty()) {
            return new ResponseEntity<>(tareas, HttpStatus.OK);
        } else {
            return crearErrorResponse("No se encontraron tareas para el proyecto.", HttpStatus.NOT_FOUND);
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
