package com.daw2.proyectoFinal.controller;

import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daw2.proyectoFinal.dtos.request.EmailRequest;
import com.daw2.proyectoFinal.model.Proyecto;
import com.daw2.proyectoFinal.model.Usuario;
import com.daw2.proyectoFinal.services.AuthenticationService;
import com.daw2.proyectoFinal.services.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@CrossOrigin(origins = { "http://mi-app-angular.s3-website-us-east-1.amazonaws.com", "http://localhost:4200" })
@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "API para la gestión de usuarios. Nota: se necesita enviar un token de login para realizar cualquier acción")
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private AuthenticationService authService;

	/**
	 * Endpoint para obtener todos los usuarios.
	 *
	 * @return ResponseEntity con la lista de todos los usuarios.
	 */
	@GetMapping
	@Operation(summary = "Obtener todos los usuarios", description = "Devuelve una lista de todos los usuarios")
	public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
		List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
		return new ResponseEntity<>(usuarios, HttpStatus.OK);
	}

	/**
	 * Endpoint para obtener un usuario por ID.
	 *
	 * @param id ID del usuario.
	 * @return ResponseEntity con el usuario encontrado o NOT_FOUND si no existe.
	 */
	@GetMapping("/{id}")
	@Operation(summary = "Obtener un usuario por ID", description = "Devuelve un usuario basado en su ID")
	public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Long id) {
		Usuario usuario = usuarioService.obtenerUsuarioPorId(id);
		if (usuario != null) {
			return new ResponseEntity<>(usuario, HttpStatus.OK);
		} else {
			return crearErrorResponse("Usuario no encontrado.", HttpStatus.NOT_FOUND);
		}
	}

	/**
	 * Endpoint para obtener un usuario por su email.
	 *
	 * @param email Objeto que contiene el email del usuario.
	 * @return ResponseEntity con el usuario encontrado o NOT_FOUND si no existe.
	 */
	@PostMapping("/email")
	@Operation(summary = "Obtener un usuario por email", description = "Devuelve un usuario basado en su email")
	public ResponseEntity<?> obtenerUsuarioPorEmail(@Valid @RequestBody EmailRequest email, BindingResult result) {
	    if (result.hasErrors()) {
	        return handleValidationErrors(result);
	    }
	    System.out.println(email);
	    try {
	        Optional<Usuario> usuario = usuarioService.encontrarPorEmailNativo(email.getEmail());
	        if (usuario.isPresent()) {
	            return new ResponseEntity<>(usuario.get(), HttpStatus.OK);
	        } else {
	            System.err.println("No existe el usuario con el correo: " + email.getEmail());
	            return crearErrorResponse("No existe el usuario", HttpStatus.NOT_FOUND);
	        }
	    } catch (Exception e) {
	        System.err.println("Ha ocurrido un error procesando la solicitud: " + e.getMessage());
	        return crearErrorResponse("Ha ocurrido un error procesando la solicitud: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	/**
	 * Endpoint para crear un nuevo usuario.
	 *
	 * @param usuario Objeto usuario a crear.
	 * @param result  Contenedor de los resultados de validación.
	 * @return ResponseEntity con el usuario creado.
	 */
	@PostMapping
	@Operation(summary = "Crear un nuevo usuario", description = "Crea un nuevo usuario y lo devuelve")
	public ResponseEntity<?> crearUsuario(@Valid @RequestBody Usuario usuario, BindingResult result) {
		if (result.hasErrors()) {
			return handleValidationErrors(result);
		}
		try {
			Usuario nuevoUsuario = authService.crearUsuario(usuario);
			return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
		} catch (Exception e) {
			System.err.println("Error al crear usuario: " + e.getMessage());
			return crearErrorResponse("El correo ya está registrado.", HttpStatus.FORBIDDEN);
		}
	}

	/**
	 * Endpoint para actualizar un usuario existente.
	 *
	 * @param id                 ID del usuario a actualizar.
	 * @param usuarioActualizado Objeto usuario con los datos actualizados.
	 * @param result             Contenedor de los resultados de validación.
	 * @return ResponseEntity con el usuario actualizado o NOT_FOUND si no existe.
	 */
	// Endpoint para actualizar un usuario existente
	@PutMapping("/{id}")
	@Operation(summary = "Actualizar un usuario", description = "Actualiza un usuario existente basado en su ID")
	public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
	    Usuario usuario = usuarioService.obtenerUsuarioPorId(id);
	    if (usuario != null) {
	        usuarioActualizado.setId(id);
	        try {
	            Usuario usuarioActualizadoDb = authService.actualizarUsuario(usuarioActualizado);
	            return new ResponseEntity<>(usuarioActualizadoDb, HttpStatus.OK);
	        } catch (Exception e) {
	            System.err.println("Error al actualizar el usuario: " + e.getMessage());
	            return crearErrorResponse("Error al actualizar el usuario: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    } else {
	        System.err.println("Usuario no encontrado con ID: " + id);
	        return crearErrorResponse("Usuario no encontrado.", HttpStatus.NOT_FOUND);
	    }
	}


	/**
	 * Endpoint para actualizar parcialmente un usuario existente.
	 *
	 * @param id                 ID del usuario a actualizar.
	 * @param usuarioActualizado Objeto usuario con los datos parcialmente
	 *                           actualizados.
	 * @param result             Contenedor de los resultados de validación.
	 * @return ResponseEntity con el usuario actualizado o NOT_FOUND si no existe.
	 */
	@PatchMapping("/{id}")
	@Operation(summary = "Actualizar parcialmente un usuario", description = "Actualiza parcialmente un usuario existente basado en su ID")
	public ResponseEntity<?> actualizarParcialUsuario(@PathVariable Long id,
			@Valid @RequestBody Usuario usuarioActualizado, BindingResult result) {
		if (result.hasErrors()) {
			return handleValidationErrors(result);
		}
		Usuario usuario = usuarioService.obtenerUsuarioPorId(id);
		if (usuario != null) {
			usuarioActualizado.setId(id);
			Usuario usuarioActualizadoDb = authService.actualizarUsuario(usuarioActualizado);
			return new ResponseEntity<>(usuarioActualizadoDb, HttpStatus.OK);
		} else {
			System.err.println("Error: Usuario no encontrado.");
			return crearErrorResponse("Usuario no encontrado.", HttpStatus.NOT_FOUND);
		}
	}

	/**
	 * Endpoint para eliminar un usuario por ID.
	 *
	 * @param id ID del usuario a eliminar.
	 * @return ResponseEntity con el estado de la operación.
	 */
	@DeleteMapping("/{id}")
	@Operation(summary = "Eliminar un usuario", description = "Elimina un usuario basado en su ID")
	public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
		boolean eliminado = usuarioService.eliminarUsuario(id);
		System.out.println(eliminado);
		if (eliminado) {
			return new ResponseEntity<>(HttpStatus.OK);
		} else {
			System.err.println("Error: Usuario no encontrado.");
			return crearErrorResponse("Usuario no encontrado.", HttpStatus.NOT_FOUND);
		}
	}

	/**
	 * Endpoint para obtener todos los proyectos de un usuario por ID.
	 *
	 * @param usuarioId ID del usuario.
	 * @return ResponseEntity con la lista de proyectos del usuario o NOT_FOUND si
	 *         no tiene proyectos.
	 */
	@GetMapping("/{usuarioId}/proyectos")
	@Operation(summary = "Obtener proyectos de un usuario", description = "Devuelve una lista de proyectos para un usuario específico basado en su ID")
	public ResponseEntity<?> obtenerProyectosDeUsuario(@PathVariable Long usuarioId) {
		List<Proyecto> proyectos = usuarioService.obtenerProyectosDeUsuario(usuarioId);
		if (!proyectos.isEmpty()) {
			return new ResponseEntity<>(proyectos, HttpStatus.OK);
		} else {
			System.err.println("Error: No se encontraron proyectos para el usuario.");
			return crearErrorResponse("No se encontraron proyectos para el usuario.", HttpStatus.NOT_FOUND);
		}
	}

	/**
	 * Maneja los errores de validación y devuelve una respuesta adecuada.
	 *
	 * @param result Contenedor de los resultados de validación.
	 * @return ResponseEntity que contiene los errores de validación.
	 */
	private ResponseEntity<Map<String, String>> handleValidationErrors(BindingResult result) {
		Map<String, String> errors = new HashMap<>();
		result.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
		System.err.println("Errores de validación: " + errors);
		return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	}

	/**
	 * Crea una respuesta de error personalizada.
	 *
	 * @param message Mensaje de error.
	 * @param status  Estado HTTP.
	 * @return ResponseEntity con el mensaje de error y el estado HTTP.
	 */
	private ResponseEntity<Map<String, String>> crearErrorResponse(String message, HttpStatus status) {
		Map<String, String> errorResponse = new HashMap<>();
		errorResponse.put("message", message);
		System.err.println("Error: " + message);
		return new ResponseEntity<>(errorResponse, status);
	}
}
