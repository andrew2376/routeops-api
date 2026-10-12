
package com.routeops.service;

import com.routeops.dto.ConductorRequest;
import com.routeops.dto.ConductorResponse;
import com.routeops.entity.Conductor;
import com.routeops.exception.ConflictoException;
import com.routeops.exception.RecursoNoEncontradoException;
import com.routeops.repository.ConductorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConductorService {

    private final ConductorRepository conductorRepository;

    public ConductorService(ConductorRepository conductorRepository) {
        this.conductorRepository = conductorRepository;
    }

    @Transactional
    public ConductorResponse crear(ConductorRequest request) {

        String numeroDocumento = request.numeroDocumento().trim();
        String correo = request.correo() == null
                ? null : request.correo().trim();

        if (correo != null && !correo.isBlank()
                && conductorRepository.existsByCorreo(correo)) {
            throw new ConflictoException(
                    "Ya existe un conductor con ese correo");
        }

        if (conductorRepository
                .findByNumeroDocumento(numeroDocumento)
                .isPresent()) {
            throw new ConflictoException(
                    "Ya existe un conductor con ese documento");
        }

        Conductor conductor = new Conductor();
        conductor.setNombres(request.nombres().trim());
        conductor.setApellidos(request.apellidos().trim());
        conductor.setNumeroDocumento(numeroDocumento);
        conductor.setTelefono(request.telefono());
        conductor.setCorreo(correo);

        return convertir(conductorRepository.save(conductor));
    }

    @Transactional(readOnly = true)
    public List<ConductorResponse> listar() {
        return conductorRepository.findAll()
                .stream()
                .map(this::convertir)
                .toList();
    }

    @Transactional(readOnly = true)
    public ConductorResponse buscarPorId(Long id) {
        Conductor conductor = conductorRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe un conductor con el ID: " + id
                ));

        return convertir(conductor);
    }

    @Transactional
    public ConductorResponse actualizar(Long id, ConductorRequest request) {

        Conductor conductor = conductorRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe un conductor con el ID: " + id
                ));

        String numeroDocumento = request.numeroDocumento().trim();
        String correo = request.correo() == null
                ? null : request.correo().trim();

        boolean documentoDuplicado = conductorRepository
                .findByNumeroDocumento(numeroDocumento)
                .filter(otro -> !otro.getId().equals(id))
                .isPresent();

        if (documentoDuplicado) {
            throw new ConflictoException(
                    "Ese documento ya pertenece a otro conductor");
        }

        if (correo != null && !correo.isBlank()) {
            boolean correoDuplicado = conductorRepository
                    .existsByCorreo(correo)
                    && !correo.equalsIgnoreCase(conductor.getCorreo());

            if (correoDuplicado) {
                throw new ConflictoException(
                        "Ese correo ya pertenece a otro conductor");
            }
        }

        conductor.setNombres(request.nombres().trim());
        conductor.setApellidos(request.apellidos().trim());
        conductor.setNumeroDocumento(numeroDocumento);
        conductor.setTelefono(request.telefono());
        conductor.setCorreo(correo);

        return convertir(conductorRepository.save(conductor));
    }

    @Transactional
    public ConductorResponse cambiarEstado(Long id, String nuevoEstado) {

        Conductor conductor = conductorRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe un conductor con el ID: " + id
                ));

        if (nuevoEstado == null
                || (!"ACTIVO".equals(nuevoEstado)
                && !"INACTIVO".equals(nuevoEstado))) {
            throw new IllegalArgumentException(
                    "El estado debe ser ACTIVO o INACTIVO");
        }

        conductor.setEstado(nuevoEstado);

        return convertir(conductorRepository.save(conductor));
    }

    private ConductorResponse convertir(Conductor conductor) {
        return new ConductorResponse(
                conductor.getId(),
                conductor.getNombres(),
                conductor.getApellidos(),
                conductor.getNumeroDocumento(),
                conductor.getTelefono(),
                conductor.getCorreo(),
                conductor.getEstado(),
                conductor.getFechaCreacion()
        );
    }
}
