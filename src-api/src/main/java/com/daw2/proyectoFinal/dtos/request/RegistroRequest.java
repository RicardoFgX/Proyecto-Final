package com.daw2.proyectoFinal.dtos.request;

/**
 * DTO (Data Transfer Object) que representa una solicitud de registro.
 * Se utiliza para transferir información entre capas de la aplicación.
 */
public class RegistroRequest {
    private String nombre;
    private String apellidos;
    private String email;
    private String contrasena;

    /**
     * Constructor por defecto.
     */
    public RegistroRequest() {
    }

    /**
     * Constructor que toma el nombre, apellidos, correo electrónico y contraseña de la solicitud.
     *
     * @param nombre     El nombre proporcionado en la solicitud.
     * @param apellidos  Los apellidos proporcionados en la solicitud.
     * @param email      El correo electrónico proporcionado en la solicitud.
     * @param contrasena La contraseña proporcionada en la solicitud.
     */
    public RegistroRequest(String nombre, String apellidos, String email, String contrasena) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.contrasena = contrasena;
    }

    /**
     * Obtiene el nombre de la solicitud.
     *
     * @return El nombre de la solicitud.
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Establece el nombre de la solicitud.
     *
     * @param nombre El nombre de la solicitud.
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Obtiene los apellidos de la solicitud.
     *
     * @return Los apellidos de la solicitud.
     */
    public String getApellidos() {
        return apellidos;
    }

    /**
     * Establece los apellidos de la solicitud.
     *
     * @param apellidos Los apellidos de la solicitud.
     */
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
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
