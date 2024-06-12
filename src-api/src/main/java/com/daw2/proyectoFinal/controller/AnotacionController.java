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

import com.daw2.proyectoFinal.model.Anotacion;
import com.daw2.proyectoFinal.services.AnotacionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@CrossOrigin(origins = {"http://mi-app-angular.s3-website-us-east-1.amazonaws.com", "http://localhost:4200"})
@RestController
@RequestMapping("/api/anotaciones")
@Tag(name = "Anotaciones", description = "API para la gestión de anotaciones. Nota: se necesita enviar un token de login para realizar cualquier acción")
public class AnotacionController {

    @Autowired
    private AnotacionService anotacionService;

    // Endpoint para obtener todas las anotaciones
    @GetMapping
    @Operation(summary = "Obtener todas las anotaciones", description = "Devuelve una lista de todas las anotaciones")
    public ResponseEntity<List<Anotacion>> obtenerTodasLasAnotaciones() {
        List<Anotacion> anotaciones = anotacionService.obtenerTodasLasAnotaciones();
        return new ResponseEntity<>(anotaciones, HttpStatus.OK);
    }

    // Endpoint para obtener una anotacion por ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener una anotación por ID", description = "Devuelve una anotación basada en su ID")
    public ResponseEntity<Anotacion> obtenerAnotacionPorId(@PathVariable Long id) {
        Anotacion anotacion = anotacionService.obtenerAnotacionPorId(id);
        if (anotacion != null) {
            return new ResponseEntity<>(anotacion, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint para obtener anotaciones por ID de usuario
    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Obtener anotaciones por ID de usuario", description = "Devuelve una lista de anotaciones para un usuario específico")
    public ResponseEntity<?> obtenerAnotacionesPorUsuario(@PathVariable Long usuarioId) {
        List<Anotacion> anotaciones = anotacionService.obtenerAnotacionesDeUsuario(usuarioId);
        if (!anotaciones.isEmpty()) {
            return new ResponseEntity<>(anotaciones, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No se encontraron anotaciones", HttpStatus.OK);
        }
    }

    // Endpoint para crear una nueva anotacion
    @PostMapping
    @Operation(summary = "Crear una nueva anotación", description = "Crea una nueva anotación y la devuelve")
    public ResponseEntity<Anotacion> crearAnotacion(@RequestBody Anotacion anotacion) {
        Anotacion nuevaAnotacion = anotacionService.crearAnotacion(anotacion);
        return new ResponseEntity<>(nuevaAnotacion, HttpStatus.CREATED);
    }

    // Endpoint para actualizar una anotacion existente
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una anotación", description = "Actualiza una anotación existente basada en su ID")
    public ResponseEntity<Anotacion> actualizarAnotacion(@PathVariable Long id,
                                                         @RequestBody Anotacion anotacionActualizada) {
        Anotacion anotacion = anotacionService.obtenerAnotacionPorId(id);
        if (anotacion != null) {
            anotacionActualizada.setId(id);
            Anotacion anotacionActualizadaDb = anotacionService.actualizarAnotacion(anotacionActualizada);
            return new ResponseEntity<>(anotacionActualizadaDb, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint para eliminar una anotacion por ID
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una anotación", description = "Elimina una anotación basada en su ID")
    public ResponseEntity<HttpStatus> eliminarAnotacion(@PathVariable Long id) {
        boolean eliminado = anotacionService.eliminarAnotacion(id);
        if (eliminado) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
