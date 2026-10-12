
package com.routeops.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ConductorRequest(

    @NotBlank(message = "Los nombres son obligatorios")
    @Size(max = 100)
    String nombres,

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100)
    String apellidos,

    @NotBlank(message = "El documento es obligatorio")
    @Size(max = 30)
    String numeroDocumento,

    @Size(max = 20)
    String telefono,

    @Email(message = "El correo no tiene un formato válido")
    @Size(max = 150)
    String correo
) {}
