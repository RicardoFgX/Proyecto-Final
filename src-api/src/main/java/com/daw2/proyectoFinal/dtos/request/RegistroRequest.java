package com.daw2.proyectoFinal.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * DTO (Data Transfer Object) que representa una solicitud de registro.
 * Se utiliza para transferir información entre capas de la aplicación.
 */
public class RegistroRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "El nombre no puede contener números ni caracteres especiales")
    private String nombre;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El correo electrónico no es válido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 5, message = "La contraseña debe tener al menos 5 caracteres")
    @Pattern(regexp = "^(?=.*\\d)[A-Za-z\\d]{5,}$", message = "La contraseña debe contener al menos un número")
    private String contrasena;

    /**
     * Constructor por defecto.
     */
    public RegistroRequest() {
    }

    /**
     * Constructor que toma el nombre, correo electrónico y contraseña de la solicitud.
     *
     * @param nombre     El nombre proporcionado en la solicitud.
     * @param email      El correo electrónico proporcionado en la solicitud.
     * @param contrasena La contraseña proporcionada en la solicitud.
     */
    public RegistroRequest(String nombre, String email, String contrasena) {
        this.nombre = nombre;
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
