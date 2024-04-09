package com.daw2.proyectoFinal.services;

import java.util.List;

import com.daw2.proyectoFinal.model.Usuario;

public interface UsuarioService {
    Usuario crearUsuario(Usuario usuario);
    Usuario obtenerUsuarioPorId(Long id);
    List<Usuario> obtenerTodosLosUsuarios();
    void eliminarUsuario(Long id);
}

