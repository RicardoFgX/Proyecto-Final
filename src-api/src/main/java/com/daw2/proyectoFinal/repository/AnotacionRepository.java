package com.daw2.proyectoFinal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.daw2.proyectoFinal.model.Anotacion;

public interface AnotacionRepository extends JpaRepository<Anotacion, Long>{
	List<Anotacion> findByUsuarioId(Long usuarioId);
}
