package com.Backend.Backend.service;

import com.Backend.Backend.dto.ServiceRequest;
import com.Backend.Backend.dto.ServiceResponse;
import com.Backend.Backend.entity.RoleType;
import com.Backend.Backend.entity.ServiceItem;
import com.Backend.Backend.entity.User;
import com.Backend.Backend.exception.ForbiddenException;
import com.Backend.Backend.exception.ResourceNotFoundException;
import com.Backend.Backend.repository.ServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Business logic for the service catalog (electrician, plumber, AC repair,
 * cleaning, etc.). Named ServiceCatalogService rather than "ServiceService"
 * to avoid confusion with the @Service annotation.
 */
@Service
public class ServiceCatalogService {

    private final ServiceRepository serviceRepository;

    public ServiceCatalogService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllActiveServices(String category, String q) {
        List<ServiceItem> services = (category == null || category.isBlank())
                ? serviceRepository.findByActiveTrue()
                : serviceRepository.findByCategoryIgnoreCaseAndActiveTrue(category);

        if (q != null && !q.isBlank()) {
            String needle = q.trim().toLowerCase();
            services = services.stream()
                    .filter(s -> (s.getTitle() != null && s.getTitle().toLowerCase().contains(needle))
                            || (s.getDescription() != null && s.getDescription().toLowerCase().contains(needle)))
                    .collect(Collectors.toList());
        }

        return services.stream().map(ServiceResponse::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServiceResponse getServiceResponse(Long id) {
        return new ServiceResponse(getServiceOrThrow(id));
    }

    public ServiceItem getServiceOrThrow(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
    }

    @Transactional
    public ServiceResponse createService(User provider, ServiceRequest request) {
        if (provider.getRole() != RoleType.PROVIDER && provider.getRole() != RoleType.ADMIN) {
            throw new ForbiddenException("Only providers can create services");
        }

        ServiceItem service = new ServiceItem();
        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setCategory(request.getCategory());
        service.setPrice(request.getPrice());
        service.setProvider(provider);
        service.setActive(true);

        return new ServiceResponse(serviceRepository.save(service));
    }

    @Transactional
    public ServiceResponse updateService(User requester, Long serviceId, ServiceRequest request) {
        ServiceItem service = getServiceOrThrow(serviceId);
        assertOwnerOrAdmin(requester, service);

        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setCategory(request.getCategory());
        service.setPrice(request.getPrice());

        return new ServiceResponse(serviceRepository.save(service));
    }

    @Transactional
    public void deleteService(User requester, Long serviceId) {
        ServiceItem service = getServiceOrThrow(serviceId);
        assertOwnerOrAdmin(requester, service);
        serviceRepository.delete(service);
    }

    @Transactional
    public ServiceResponse setActive(User requester, Long serviceId, boolean active) {
        ServiceItem service = getServiceOrThrow(serviceId);
        assertOwnerOrAdmin(requester, service);
        service.setActive(active);
        return new ServiceResponse(serviceRepository.save(service));
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getMyServices(User provider) {
        return serviceRepository.findByProviderId(provider.getId()).stream()
                .map(ServiceResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllServicesAdmin() {
        return serviceRepository.findAll().stream()
                .map(ServiceResponse::new)
                .collect(Collectors.toList());
    }

    private void assertOwnerOrAdmin(User requester, ServiceItem service) {
        boolean isOwner = service.getProvider().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == RoleType.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("You do not own this service");
        }
    }
}