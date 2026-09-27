package com.Backend.Backend.controller;

import com.Backend.Backend.dto.ServiceRequest;
import com.Backend.Backend.dto.ServiceResponse;
import com.Backend.Backend.entity.User;
import com.Backend.Backend.service.ServiceCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceCatalogService serviceCatalogService;

    public ServiceController(ServiceCatalogService serviceCatalogService) {
        this.serviceCatalogService = serviceCatalogService;
    }

    /** Public: anyone can browse the active service catalog, optionally filtered by category. */
    @GetMapping
    public List<ServiceResponse> getAllServices(@RequestParam(required = false) String category,
                                                 @RequestParam(required = false) String q) {
        return serviceCatalogService.getAllActiveServices(category, q);
    }

    /** Public: view a single service's details. */
    @GetMapping("/{id}")
    public ServiceResponse getServiceById(@PathVariable Long id) {
        return serviceCatalogService.getServiceResponse(id);
    }

    /** Provider: services they own. */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('PROVIDER','ADMIN')")
    public List<ServiceResponse> getMyServices(@AuthenticationPrincipal User currentUser) {
        return serviceCatalogService.getMyServices(currentUser);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROVIDER','ADMIN')")
    public ResponseEntity<ServiceResponse> createService(@AuthenticationPrincipal User currentUser,
                                                           @Valid @RequestBody ServiceRequest request) {
        ServiceResponse response = serviceCatalogService.createService(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROVIDER','ADMIN')")
    public ServiceResponse updateService(@AuthenticationPrincipal User currentUser,
                                          @PathVariable Long id,
                                          @Valid @RequestBody ServiceRequest request) {
        return serviceCatalogService.updateService(currentUser, id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROVIDER','ADMIN')")
    public ResponseEntity<Void> deleteService(@AuthenticationPrincipal User currentUser, @PathVariable Long id) {
        serviceCatalogService.deleteService(currentUser, id);
        return ResponseEntity.noContent().build();
    }

    /** Provider: toggle a service's visibility without deleting it. */
    @PatchMapping("/{id}/active")
    @PreAuthorize("hasAnyRole('PROVIDER','ADMIN')")
    public ServiceResponse setActive(@AuthenticationPrincipal User currentUser,
                                      @PathVariable Long id,
                                      @RequestParam boolean active) {
        return serviceCatalogService.setActive(currentUser, id, active);
    }
}
