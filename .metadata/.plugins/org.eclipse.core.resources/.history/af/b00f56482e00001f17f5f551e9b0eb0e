package com.daw2.proyectoFinal.servicesImpl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw2.proyectoFinal.model.Proyecto;
import com.daw2.proyectoFinal.model.Tarea;
import com.daw2.proyectoFinal.model.Usuario;
import com.daw2.proyectoFinal.repository.ProyectoRepository;
import com.daw2.proyectoFinal.repository.UsuarioRepository;
import com.daw2.proyectoFinal.services.UsuarioService;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ProyectoRepository proyectoRepository;

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario obtenerUsuarioPorId(Long id) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        return optionalUsuario.orElse(null);
    }

    @Override
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    public boolean eliminarUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Usuario obtenerUsuarioPorNombre(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario);
    }
    
    @Override
    public Usuario actualizarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    
    @Override
    public List<Proyecto> obtenerProyectosDeUsuario(Long usuarioId) {
        return proyectoRepository.findByUsuariosId(usuarioId);
    }
}
