package com.daw2.proyectoFinal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.daw2.proyectoFinal.model.Proyecto;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
	//Si necesito más métodos los añado aqui
}