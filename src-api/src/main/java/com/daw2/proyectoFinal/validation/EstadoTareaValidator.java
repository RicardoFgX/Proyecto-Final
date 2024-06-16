package com.daw2.proyectoFinal.validation;

import com.daw2.proyectoFinal.model.EstadoTarea;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EstadoTareaValidator implements ConstraintValidator<ValidEstadoTarea, EstadoTarea> {

    @Override
    public void initialize(ValidEstadoTarea constraintAnnotation) {
    }

    @Override
    public boolean isValid(EstadoTarea estado, ConstraintValidatorContext context) {
        if (estado == null) {
            return false;
        }
        return estado == EstadoTarea.PENDIENTE || estado == EstadoTarea.EN_PROGRESO || estado == EstadoTarea.COMPLETADA;
    }
}
