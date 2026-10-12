
package com.routeops.repository;

import com.routeops.entity.Conductor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConductorRepository
        extends JpaRepository<Conductor, Long> {

    Optional<Conductor> findByNumeroDocumento(
            String numeroDocumento);

    boolean existsByCorreo(String correo);
}
