
package com.daw2.proyectoFinal.conf;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@Configuration
@OpenAPIDefinition(
		info = @Info(
				title = "Blue Bull - Task Manager",
				version = "1.0.0",
				description = "Swagger de mi API para el proyecto Final"
				)
		)
public class OpenApiConfig {
	
}
