package com.daw2.proyectoFinal.dtos.request;

/**
 * DTO (Data Transfer Object) que representa una solicitud de inicio de sesión.
 * Se utiliza para transferir información entre capas de la aplicación.
 */
public class LoginRequest {
    private String email;
    private String contrasena;

    /**
     * Constructor por defecto.
     */
    public LoginRequest() {
    }

    /**
     * Constructor que toma el correo electrónico y la contraseña de la solicitud.
     *
     * @param email      El correo electrónico proporcionado en la solicitud.
     * @param contrasena La contraseña proporcionada en la solicitud.
     */
    public LoginRequest(String email, String contrasena) {
        this.email = email;
        this.contrasena = contrasena;
    }

    /**
     * Obtiene el correo electrónico de la solicitud.
     *
     * @return El correo electrónico de la solicitud.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Establece el correo electrónico de la solicitud.
     *
     * @param email El correo electrónico de la solicitud.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Obtiene la contraseña de la solicitud.
     *
     * @return La contraseña de la solicitud.
     */
    public String getContrasena() {
        return contrasena;
    }

    /**
     * Establece la contraseña de la solicitud.
     *
     * @param contrasena La contraseña de la solicitud.
     */
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}

