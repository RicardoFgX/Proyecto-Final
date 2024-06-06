package com.daw2.proyectoFinal.services;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.daw2.proyectoFinal.dtos.UsuarioDTO;
import com.daw2.proyectoFinal.model.Proyecto;
import com.daw2.proyectoFinal.model.Usuario;

public interface UsuarioService {
    Usuario crearUsuario(Usuario usuario);
    Usuario obtenerUsuarioPorId(Long id);
    List<Usuario> obtenerTodosLosUsuarios();
    Usuario actualizarUsuario(Usuario usuario);
    boolean eliminarUsuario(Long id);
    List<Proyecto> obtenerProyectosDeUsuario(Long usuarioId);
    UserDetailsService userDetailsService();
    List<UsuarioDTO> obtenerTodos();
    Optional<Usuario> encontrarPorEmailNativo(String email);
}

