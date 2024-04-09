package com.daw2.proyectoFinal.servicesImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw2.proyectoFinal.model.Usuario;
import com.daw2.proyectoFinal.repository.UsuarioRepository;
import com.daw2.proyectoFinal.services.UsuarioService;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

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
    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

}
