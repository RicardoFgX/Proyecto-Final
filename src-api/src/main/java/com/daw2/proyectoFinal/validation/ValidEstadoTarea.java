package com.daw2.proyectoFinal.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = EstadoTareaValidator.class)
@Target({ ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidEstadoTarea {
    String message() default "El estado debe ser PENDIENTE, EN_PROGRESO o COMPLETADA";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
