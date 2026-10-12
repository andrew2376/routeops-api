
package com.routeops.dto;

import java.time.LocalDateTime;

public record ConductorResponse(
    Long id,
    String nombres,
    String apellidos,
    String numeroDocumento,
    String telefono,
    String correo,
    String estado,
    LocalDateTime fechaCreacion
) {}
