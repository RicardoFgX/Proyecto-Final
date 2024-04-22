package com.daw2.proyectoFinal.dtos.response;

import com.daw2.proyectoFinal.model.Usuario;

/**
 * DTO (Data Transfer Object) que representa una respuesta de autenticación JWT.
 * Se utiliza para transferir información entre capas de la aplicación.
 */
public class JwtAuthenticationResponse {
    private Usuario user;
    private String token;

    public JwtAuthenticationResponse(Usuario user, String token) {
        this.user = user;
        this.token = token;
    }

    public Usuario getUser() {
        return user;
    }

    public void setUser(Usuario user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public static JwtAuthenticationResponseBuilder builder() {
        return new JwtAuthenticationResponseBuilder();
    }

    public static class JwtAuthenticationResponseBuilder {
        private Usuario user;
        private String token;

        public JwtAuthenticationResponseBuilder user(Usuario user) {
            this.user = user;
            return this;
        }

        public JwtAuthenticationResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public JwtAuthenticationResponse build() {
            return new JwtAuthenticationResponse(user, token);
        }
    }
}
