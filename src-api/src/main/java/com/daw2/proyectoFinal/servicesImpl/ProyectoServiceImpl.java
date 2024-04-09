package com.daw2.proyectoFinal.servicesImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw2.proyectoFinal.model.Proyecto;
import com.daw2.proyectoFinal.repository.ProyectoRepository;
import com.daw2.proyectoFinal.services.ProyectoService;

@Service
public class ProyectoServiceImpl implements ProyectoService {

    @Autowired
    private ProyectoRepository proyectoRepository;

    @Override
    public Proyecto crearProyecto(Proyecto proyecto) {
        return proyectoRepository.save(proyecto);
    }

    @Override
    public Proyecto obtenerProyectoPorId(Long id) {
        Optional<Proyecto> optionalProyecto = proyectoRepository.findById(id);
        return optionalProyecto.orElse(null);
    }

    @Override
    public List<Proyecto> obtenerTodosLosProyectos() {
        return proyectoRepository.findAll();
    }

    @Override
    public void eliminarProyecto(Long id) {
        proyectoRepository.deleteById(id);
    }

}
