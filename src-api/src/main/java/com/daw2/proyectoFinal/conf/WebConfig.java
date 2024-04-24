package com.daw2.proyectoFinal.conf;

import java.net.http.HttpHeaders;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
/*
@Configuration
public class WebConfig {
	
	@Bean
	public WebMvcConfigurer corsConfig() {
		return new WebMvcConfigurer() {
			@Override
		    public void addCorsMappings(CorsRegistry registry) {
		        registry.addMapping("/**")
		                .allowedOrigins("*") // Permite todas las solicitudes. Puedes ajustarlo según tus necesidades.
		                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
		                .allowedHeaders("*")
		                .allowCredentials(true);
		    }
		};
	}
}
*/