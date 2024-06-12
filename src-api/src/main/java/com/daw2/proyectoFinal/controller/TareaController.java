package com.daw2.proyectoFinal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.daw2.proyectoFinal.services.TareaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@CrossOrigin(origins = {"http://mi-app-angular.s3-website-us-east-1.amazonaws.com", "http://localhost:4200"})
@RestController
@RequestMapping("/api/tareas")
@Tag(name = "Tareas", description = "API para la gestión de tareas. Nota: se necesita enviar un token de login para realizar cualquier acción")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    // Endpoint para obtener todas las tareas
    @GetMapping
    @Operation(summary = "Obtener todas las tareas", description = "Devuelve una lista de todas las tareas")
    public ResponseEntity<List<Tarea>> obtenerTodasLasTareas() {
        List<Tarea> tareas = tareaService.obtenerTodasLasTareas();
        return new ResponseEntity<>(tareas, HttpStatus.OK);
    }

    // Endpoint para obtener una tarea por ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener una tarea por ID", description = "Devuelve una tarea basada en su ID")
    public ResponseEntity<Tarea> obtenerTareaPorId(@PathVariable Long id) {
        Tarea tarea = tareaService.obtenerTareaPorId(id);
        if (tarea != null) {
            return new ResponseEntity<>(tarea, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint para crear una nueva tarea
    @PostMapping
    @Operation(summary = "Crear una nueva tarea", description = "Crea una nueva tarea y la devuelve")
    public ResponseEntity<Tarea> crearTarea(@RequestBody Tarea tarea) {
        Tarea nuevaTarea = tareaService.crearTarea(tarea);
        return new ResponseEntity<>(nuevaTarea, HttpStatus.CREATED);
    }

    // Endpoint para actualizar una tarea existente
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una tarea", description = "Actualiza una tarea existente basada en su ID")
    public ResponseEntity<Tarea> actualizarTarea(@PathVariable Long id, @RequestBody Tarea tareaActualizada) {
        Tarea tarea = tareaService.obtenerTareaPorId(id);
        if (tarea != null) {
            tareaActualizada.setId(id);
            Tarea tareaActualizadaDb = tareaService.actualizarTarea(tareaActualizada);
            return new ResponseEntity<>(tareaActualizadaDb, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint para eliminar una tarea por ID
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una tarea", description = "Elimina una tarea basada en su ID")
    public ResponseEntity<HttpStatus> eliminarTarea(@PathVariable Long id) {
        boolean eliminado = tareaService.eliminarTarea(id);
        if (eliminado) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint para obtener tareas por ID de proyecto
    @GetMapping("/proyecto/{proyectoId}")
    @Operation(summary = "Obtener tareas por ID de proyecto", description = "Devuelve una lista de tareas para un proyecto específico")
    public ResponseEntity<List<Tarea>> obtenerTareasPorProyecto(@PathVariable Long proyectoId) {
        List<Tarea> tareas = tareaService.obtenerTareasPorProyecto(proyectoId);
        if (!tareas.isEmpty()) {
            return new ResponseEntity<>(tareas, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
