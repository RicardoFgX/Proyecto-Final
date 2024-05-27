package com.daw2.proyectoFinal.servicesImpl;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw2.proyectoFinal.model.Proyecto;
import com.daw2.proyectoFinal.model.Usuario;
import com.daw2.proyectoFinal.repository.ProyectoRepository;
import com.daw2.proyectoFinal.services.ProyectoService;
import com.daw2.proyectoFinal.services.UsuarioService;

@Service
public class ProyectoServiceImpl implements ProyectoService {

    @Autowired
    private ProyectoRepository proyectoRepository;
    
    @Autowired
	private UsuarioService usuarioService;

    @Override
    public Proyecto crearProyecto(Proyecto proyecto) {
        Proyecto nuevoProyecto = new Proyecto();
        nuevoProyecto.setNombre(proyecto.getNombre());
        nuevoProyecto.setDescripcion(proyecto.getDescripcion());
        nuevoProyecto.setFechaCreacion(proyecto.getFechaCreacion());
        nuevoProyecto.setUltimaFechaModificacion(proyecto.getUltimaFechaModificacion());

        Set<Usuario> usuariosOriginales = proyecto.getUsuarios();
        Set<Usuario> usuariosCompletos = new HashSet<>();

        for (Usuario usuarioOriginal : usuariosOriginales) {
            Usuario usuarioCompleto = usuarioService.obtenerUsuarioPorId(usuarioOriginal.getId());
            if (usuarioCompleto != null) {
                usuariosCompletos.add(usuarioCompleto);
            } else {
                // Manejar el caso en el que no se pueda encontrar el usuario
                // Aquí puedes lanzar una excepción, registrar un error, etc.
                // En este ejemplo, simplemente imprimimos un mensaje
                System.out.println("No se pudo encontrar el usuario con ID: " + usuarioOriginal.getId());
            }
        }

        nuevoProyecto.setUsuarios(usuariosCompletos);
        return proyectoRepository.save(nuevoProyecto);
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
    public boolean eliminarProyecto(Long id) {
        if (proyectoRepository.existsById(id)) {
        	proyectoRepository.deleteById(id);
            return true;
        }
        return false;
    }

	@Override
	public Proyecto actualizarProyecto(Proyecto proyecto) {
		return proyectoRepository.save(proyecto);
	}
    
	@Override
    public List<Proyecto> obtenerProyectosConUsuario(Long usuarioId) {
        return proyectoRepository.findByUsuariosId(usuarioId);
    }

}
