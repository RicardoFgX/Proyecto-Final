package com.daw2.proyectoFinal.servicesImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw2.proyectoFinal.model.Anotacion;
import com.daw2.proyectoFinal.model.Usuario;
import com.daw2.proyectoFinal.repository.AnotacionRepository;
import com.daw2.proyectoFinal.services.AnotacionService;

@Service
public class AnotacionServiceImpl implements AnotacionService {

    @Autowired
    private AnotacionRepository anotacionRepository;

    @Override
    public Anotacion crearAnotacion(Anotacion anotacion) {
        return anotacionRepository.save(anotacion);
    }

    @Override
    public Anotacion obtenerAnotacionPorId(Long id) {
        Optional<Anotacion> optionalAnotacion = anotacionRepository.findById(id);
        return optionalAnotacion.orElse(null);
    }

    @Override
    public List<Anotacion> obtenerAnotacionesDeUsuario(Long usuarioId) {
        return anotacionRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public List<Anotacion> obtenerTodasLasAnotaciones() {
        return anotacionRepository.findAll();
    }
    
    @Override
    public boolean eliminarAnotacion(Long id) {
        if (anotacionRepository.existsById(id)) {
        	anotacionRepository.deleteById(id);
            return true;
        }
        return false;
    }

	@Override
	public Anotacion actualizarAnotacion(Anotacion anotacion) {
		return anotacionRepository.save(anotacion);
	}

    // Otros métodos de servicio según sea necesario
}
