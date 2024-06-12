package com.daw2.proyectoFinal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

@CrossOrigin(origins = {"http://mi-app-angular.s3-website-us-east-1.amazonaws.com", "http://localhost:4200"})
@RestController
@RequestMapping("/api/proyectos")
@Tag(name = "Proyectos", description = "API para la gestión de proyectos. API para la gestión de anotaciones. Nota: se necesita enviar un token de login para realizar cualquier acción")
public class ProyectoController {

    @Autowired
    private ProyectoService proyectoService;

    // Endpoint para obtener todos los proyectos
    @GetMapping
    @Operation(summary = "Obtener todos los proyectos", description = "Devuelve una lista de todos los proyectos")
    public ResponseEntity<List<Proyecto>> obtenerTodosLosProyectos() {
        List<Proyecto> proyectos = proyectoService.obtenerTodosLosProyectos();
        return new ResponseEntity<>(proyectos, HttpStatus.OK);
    }

    // Endpoint para obtener un proyecto por ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener un proyecto por ID", description = "Devuelve un proyecto basado en su ID")
    public ResponseEntity<Proyecto> obtenerProyectoPorId(@PathVariable Long id) {
        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        if (proyecto != null) {
            return new ResponseEntity<>(proyecto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint para crear un nuevo proyecto
    @PostMapping
    @Operation(summary = "Crear un nuevo proyecto", description = "Crea un nuevo proyecto y lo devuelve")
    public ResponseEntity<Proyecto> crearProyecto(@RequestBody Proyecto proyecto) {
        Proyecto nuevoProyecto = proyectoService.crearProyecto(proyecto);
        return new ResponseEntity<>(nuevoProyecto, HttpStatus.CREATED);
    }

    // Endpoint para actualizar un proyecto existente
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un proyecto", description = "Actualiza un proyecto existente basado en su ID")
    public ResponseEntity<Proyecto> actualizarProyecto(@PathVariable Long id, @RequestBody Proyecto proyectoActualizado) {
        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        if (proyecto != null) {
            proyectoActualizado.setId(id);
            Proyecto proyectoActualizadoDb = proyectoService.actualizarProyecto(proyectoActualizado);
            return new ResponseEntity<>(proyectoActualizadoDb, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Endpoint para actualizar parcialmente un proyecto existente
    @PatchMapping("/{id}")
    @Operation(summary = "Actualizar parcialmente un proyecto", description = "Actualiza parcialmente un proyecto existente basado en su ID")
    public ResponseEntity<Proyecto> actualizarParcialProyecto(@PathVariable Long id, @RequestBody Proyecto proyectoActualizado) {
        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        if (proyecto != null) {
            proyectoActualizado.setId(id);
            Proyecto proyectoActualizadoDb = proyectoService.actualizarProyecto(proyectoActualizado);
            return new ResponseEntity<>(proyectoActualizadoDb, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint para eliminar un proyecto por ID
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un proyecto", description = "Elimina un proyecto basado en su ID")
    public ResponseEntity<HttpStatus> eliminarProyecto(@PathVariable Long id) {
        boolean eliminado = proyectoService.eliminarProyecto(id);
        if (eliminado) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
