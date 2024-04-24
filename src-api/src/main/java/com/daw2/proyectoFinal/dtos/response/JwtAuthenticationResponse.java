package com.daw2.proyectoFinal.dtos.response;

import com.daw2.proyectoFinal.model.Usuario;

/**
 * DTO (Data Transfer Object) que representa una respuesta de autenticación JWT.
 * Se utiliza para transferir información entre capas de la aplicación.
 */
public class JwtAuthenticationResponse {
    private UserResponse user;

    public JwtAuthenticationResponse(UserResponse user) {
        this.user = user;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public static JwtAuthenticationResponseBuilder builder() {
        return new JwtAuthenticationResponseBuilder();
    }

    public static class JwtAuthenticationResponseBuilder {
        private UserResponse user;

        public JwtAuthenticationResponseBuilder user(UserResponse user) {
            this.user = user;
            return this;
        }

        public JwtAuthenticationResponse build() {
            return new JwtAuthenticationResponse(user);
        }
    }

    public static class UserResponse {
        private String email;
        private String name;
        private String rol;
        private String token;


        public UserResponse(Usuario user, String token) {
            this.email = user.getEmail();
            this.name = user.getNombre();
            this.rol = user.getRoles().toString();
            this.token = token;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
        
        public String getRol() {
            return rol;
        }

        public void setRol(String rol) {
            this.rol = rol;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }
}
