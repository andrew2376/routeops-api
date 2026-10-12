
package com.routeops.controller;

import com.routeops.dto.ConductorRequest;
import com.routeops.dto.ConductorResponse;
import com.routeops.service.ConductorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conductores")
public class ConductorController {

    private final ConductorService conductorService;

    public ConductorController(ConductorService conductorService) {
        this.conductorService = conductorService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConductorResponse crear(
            @Valid @RequestBody ConductorRequest request) {
        return conductorService.crear(request);
    }

    @GetMapping
    public List<ConductorResponse> listar() {
        return conductorService.listar();
    }

    @GetMapping("/{id}")
    public ConductorResponse buscarPorId(@PathVariable Long id) {
        return conductorService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public ConductorResponse actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ConductorRequest request) {
        return conductorService.actualizar(id, request);
    }

    @PatchMapping("/{id}/estado")
    public ConductorResponse cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> datos) {
        return conductorService.cambiarEstado(
                id,
                datos.get("estado")
        );
    }
}
