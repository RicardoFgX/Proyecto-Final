package com.daw2.proyectoFinal.servicesImpl;

import java.util.Optional;

import lombok.Builder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.daw2.proyectoFinal.dtos.request.LoginRequest;
import com.daw2.proyectoFinal.dtos.request.RegistroRequest;
import com.daw2.proyectoFinal.dtos.response.JwtAuthenticationResponse;
import com.daw2.proyectoFinal.model.Rol;
import com.daw2.proyectoFinal.model.Usuario;
import com.daw2.proyectoFinal.repository.UsuarioRepository;
import com.daw2.proyectoFinal.services.AuthenticationService;
import com.daw2.proyectoFinal.services.JwtService;
import com.daw2.proyectoFinal.services.UsuarioService;

@Builder
@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationServiceImpl(UsuarioRepository usuarioRepository, UsuarioService usuarioService, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public JwtAuthenticationResponse signup(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email ya está en uso.");
        }

        Usuario user = new Usuario();
        user.setNombre(request.getNombre());
        user.setEmail(request.getEmail());
        user.setContrasena(passwordEncoder.encode(request.getContrasena()));
        user.getRoles().add(Rol.USUARIO);
        usuarioRepository.save(user);
        String jwt = jwtService.generateToken(user);

        JwtAuthenticationResponse.UserResponse userResponse = new JwtAuthenticationResponse.UserResponse(user, jwt);

        return JwtAuthenticationResponse.builder().user(userResponse).build();
    }

    @Override
    public JwtAuthenticationResponse signin(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getContrasena()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        Optional<Usuario> optionalUser = usuarioRepository.findByEmail(request.getEmail());

        Usuario user = optionalUser.orElseThrow(() -> new IllegalArgumentException("Email o contraseña inválidos."));
        String jwt = jwtService.generateToken(user);

        JwtAuthenticationResponse.UserResponse userResponse = new JwtAuthenticationResponse.UserResponse(user, jwt);

        return JwtAuthenticationResponse.builder().user(userResponse).build();
    }

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        String contrasenaCodificada = passwordEncoder.encode(usuario.getContrasena());
        usuario.setContrasena(contrasenaCodificada);
        usuario.getRoles().add(Rol.USUARIO);
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario actualizarUsuario(Usuario usuario) {
        Usuario userOld = usuarioService.obtenerUsuarioPorId(usuario.getId());
        if (usuario.getNombre() != null) {
            userOld.setNombre(usuario.getNombre());
        }
        if (usuario.getApellidos() != null) {
            userOld.setApellidos(usuario.getApellidos());
        }
        if (usuario.getEmail() != null) {
            userOld.setEmail(usuario.getEmail());
        }
        if (usuario.getContrasena() != null) {
            String contrasenaCodificada = passwordEncoder.encode(usuario.getContrasena());
            userOld.setContrasena(contrasenaCodificada);
        }
        if (usuario.getRoles() == null) {
            userOld.getRoles().add(Rol.USUARIO);
        }
        return usuarioRepository.save(userOld);
    }
}
