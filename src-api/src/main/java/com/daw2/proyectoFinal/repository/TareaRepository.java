package com.daw2.proyectoFinal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.daw2.proyectoFinal.model.Tarea;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
	List<Tarea> findByProyectoId(Long proyectoId);
	List<Tarea> findByProyectoUsuariosId(Long usuarioId);
}
