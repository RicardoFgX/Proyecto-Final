package com.daw2.proyectoFinal.model;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Clase que representa la entidad Usuario en la base de datos.
 */
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
    
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre no puede estar en blanco")
    private String nombre;

    private String apellidos;

    @Column(unique = true)
    @Email(message = "La dirección de correo electrónico debe ser válida")
    @NotBlank(message = "La contraseña no puede estar en blanco")
    private String email;

    @NotBlank(message = "La contraseña no puede estar en blanco")
    private String contrasena;

    @ElementCollection(fetch = FetchType.EAGER, targetClass = Rol.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "usuario_rol")
    @Column(name = "Rol")
    private Set<Rol> rol = new HashSet<>();
    
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "usuario_proyecto",
        joinColumns = { @JoinColumn(name = "usuario_id") },
        inverseJoinColumns = { @JoinColumn(name = "proyecto_id") }
    )
    @JsonIgnore
    private Set<Proyecto> proyectos = new HashSet<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Anotacion> anotaciones;

    @Transactional
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        rol.size();
        return rol.stream().map(role -> new SimpleGrantedAuthority(role.name())).collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getPassword() {
        return contrasena;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public Set<Rol> getRoles() {
        return rol;
    }

    public void setRoles(Set<Rol> roles) {
        this.rol = roles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<Anotacion> getAnotaciones() {
        return anotaciones;
    }

    public void setAnotaciones(Set<Anotacion> anotaciones) {
        this.anotaciones = anotaciones;
    }
}