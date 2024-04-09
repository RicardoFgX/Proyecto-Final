package com.daw2.proyectoFinal.services;

import java.util.List;

import com.daw2.proyectoFinal.model.Anotacion;

public interface AnotacionService {
    Anotacion crearAnotacion(Anotacion anotacion);
    Anotacion obtenerAnotacionPorId(Long id);
    List<Anotacion> obtenerAnotacionesDeUsuario(Long usuarioId);
    List<Anotacion> obtenerTodasLasAnotaciones();
    void eliminarAnotacion(Long id);
    
}
