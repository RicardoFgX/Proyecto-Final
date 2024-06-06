package com.daw2.proyectoFinal.dtos.request;

public class EmailRequest {
    private String email;

    // Constructor
    public EmailRequest() {
    }

    public EmailRequest(String email) {
        this.email = email;
    }

    // Getter y Setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
