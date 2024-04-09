package com.daw2.proyectoFinal.servicesImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw2.proyectoFinal.model.Tarea;
import com.daw2.proyectoFinal.repository.TareaRepository;
import com.daw2.proyectoFinal.services.TareaService;

@Service
public class TareaServiceImpl implements TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    @Override
    public Tarea crearTarea(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    @Override
    public Tarea obtenerTareaPorId(Long id) {
        Optional<Tarea> optionalTarea = tareaRepository.findById(id);
        return optionalTarea.orElse(null);
    }

    @Override
    public List<Tarea> obtenerTodasLasTareas() {
        return tareaRepository.findAll();
    }

    @Override
    public List<Tarea> obtenerTareasPorProyecto(Long proyectoId) {
        return tareaRepository.findByProyectoId(proyectoId);
    }

    @Override
    public void eliminarTarea(Long id) {
        tareaRepository.deleteById(id);
    }

}
