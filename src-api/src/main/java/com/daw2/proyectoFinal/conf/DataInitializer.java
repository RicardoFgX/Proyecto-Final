package com.daw2.proyectoFinal.conf;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.daw2.proyectoFinal.model.Anotacion;
import com.daw2.proyectoFinal.model.EstadoTarea;
import com.daw2.proyectoFinal.model.Proyecto;
import com.daw2.proyectoFinal.model.Rol;
import com.daw2.proyectoFinal.model.Tarea;
import com.daw2.proyectoFinal.model.Usuario;
import com.daw2.proyectoFinal.repository.UsuarioRepository;
import com.daw2.proyectoFinal.services.AnotacionService;
import com.daw2.proyectoFinal.services.ProyectoService;
import com.daw2.proyectoFinal.services.TareaService;
import com.daw2.proyectoFinal.services.UsuarioService;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;

@Component
public class DataInitializer implements CommandLineRunner {

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private AnotacionService anotacionService;

	@Autowired
	private ProyectoService proyectoService;

	@Autowired
	private TareaService tareaService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) {

		Usuario usuario1 = new Usuario();
		Usuario admin = new Usuario();

		if (usuarioService.obtenerUsuarioPorId(1L) == null) {

			usuario1.setNombre("usuarioejemplo");
			usuario1.setApellidos("1234");
			usuario1.setEmail("usuarioejemplo@gmail.com");
			usuario1.setContrasena(passwordEncoder.encode("1234"));
			usuario1.getRoles().add(Rol.USUARIO);
			usuarioRepository.save(usuario1);

			admin.setNombre("admin");
			admin.setApellidos("Fernandez admin");
			admin.setEmail("admin@gmail.com");
			admin.setContrasena(passwordEncoder.encode("admin"));
			admin.getRoles().add(Rol.ADMINISTRADOR);
			usuarioRepository.save(admin);

			// Crear Anotaciones para usuario2
			Anotacion anotacion1 = new Anotacion();
			anotacion1.setContenido("Primera anotacion de usuario2");
			anotacion1.setTitulo("Prueba1");
			anotacion1.setUsuario(usuario1);

			Anotacion anotacion2 = new Anotacion();
			anotacion2.setContenido("Segunda anotacion de usuario2");
			anotacion2.setTitulo("Prueba2");
			anotacion2.setUsuario(usuario1);

			anotacionService.crearAnotacion(anotacion1);
			anotacionService.crearAnotacion(anotacion2);

			// Crear Proyecto
			Proyecto proyecto = new Proyecto();
			proyecto.setNombre("Proyecto1");
			proyecto.setDescripcion("Descripción del Proyecto1");
			
			proyecto = proyectoService.crearProyecto(proyecto);

			// Agregar Usuarios al Proyecto
			proyecto.setUsuarios(new HashSet<>(Arrays.asList(usuario1, admin)));
			proyectoService.crearProyecto(proyecto);

			// Crear Proyecto
			Proyecto proyecto2 = new Proyecto();
			proyecto2.setNombre("Proyecto2");
			proyecto2.setDescripcion("Descripción del Proyecto2");
			
			proyecto2 = proyectoService.crearProyecto(proyecto2);

			// Agregar Usuarios al Proyecto
			proyecto.setUsuarios(new HashSet<>(Arrays.asList(usuario1, admin)));
			proyectoService.crearProyecto(proyecto2);

			// Crear Tareas para el Proyecto
			Tarea tarea1 = new Tarea();
			tarea1.setNombre("Tarea1");
			tarea1.setDescripcion("Descripción de Tarea1");
			tarea1.setFechaVencimiento(LocalDate.now().plusDays(7));
			tarea1.setEstado(EstadoTarea.COMPLETADA);

			tarea1.setProyecto(proyecto);
			tareaService.crearTarea(tarea1);

			Tarea tarea2 = new Tarea();
			tarea2.setNombre("Tarea2");
			tarea2.setDescripcion("Descripción de Tarea2");
			tarea2.setFechaVencimiento(LocalDate.now().plusDays(14));
			tarea2.setEstado(EstadoTarea.EN_PROGRESO);

			tarea2.setProyecto(proyecto);
			tareaService.crearTarea(tarea2);

			Tarea tarea3 = new Tarea();
			tarea3.setNombre("Tarea3");
			tarea3.setDescripcion("Descripción de Tarea3");
			tarea3.setFechaVencimiento(LocalDate.now().plusDays(21));
			tarea3.setEstado(EstadoTarea.EN_PROGRESO);

			tarea3.setProyecto(proyecto);
			tareaService.crearTarea(tarea3);

			Tarea tarea4 = new Tarea();
			tarea4.setNombre("Tarea4");
			tarea4.setDescripcion("Descripción de Tarea4");
			tarea4.setFechaVencimiento(LocalDate.now().plusDays(28));
			tarea4.setEstado(EstadoTarea.PENDIENTE);

			tarea4.setProyecto(proyecto);
			tareaService.crearTarea(tarea4);

			// Crear y asignar una tarea 5 a un proyecto
			Tarea tarea5 = new Tarea();
			tarea5.setNombre("Tarea5");
			tarea5.setDescripcion("Descripción de Tarea5");
			tarea5.setFechaVencimiento(LocalDate.now().plusDays(14));
			tarea5.setEstado(EstadoTarea.EN_PROGRESO);
			tarea5.setProyecto(proyecto2);
			tareaService.crearTarea(tarea5);

			// Crear y asignar una tarea 6 a un proyecto
			Tarea tarea6 = new Tarea();
			tarea6.setNombre("Tarea6");
			tarea6.setDescripcion("Descripción de Tarea6");
			tarea6.setFechaVencimiento(LocalDate.now().plusDays(7));
			tarea6.setEstado(EstadoTarea.PENDIENTE);
			tarea6.setProyecto(proyecto2);
			tareaService.crearTarea(tarea6);

			// Crear y asignar una tarea 7 a un proyecto
			Tarea tarea7 = new Tarea();
			tarea7.setNombre("Tarea7");
			tarea7.setDescripcion("Descripción de Tarea7");
			tarea7.setFechaVencimiento(LocalDate.now().plusDays(21));
			tarea7.setEstado(EstadoTarea.EN_PROGRESO);
			tarea7.setProyecto(proyecto2);
			tareaService.crearTarea(tarea7);

			// Crear y asignar una tarea 8 a un proyecto
			Tarea tarea8 = new Tarea();
			tarea8.setNombre("Tarea8");
			tarea8.setDescripcion("Descripción de Tarea8");
			tarea8.setFechaVencimiento(LocalDate.now().plusDays(10));
			tarea8.setEstado(EstadoTarea.PENDIENTE);
			tarea8.setProyecto(proyecto2);
			tareaService.crearTarea(tarea8);

			// Crear y asignar una tarea 9 a un proyecto
			Tarea tarea9 = new Tarea();
			tarea9.setNombre("Tarea9");
			tarea9.setDescripcion("Descripción de Tarea9");
			tarea9.setFechaVencimiento(LocalDate.now().plusDays(5));
			tarea9.setEstado(EstadoTarea.EN_PROGRESO);
			tarea9.setProyecto(proyecto2);
			tareaService.crearTarea(tarea9);

		}
	}

}
