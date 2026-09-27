package com.Backend.Backend.dto;

import com.Backend.Backend.entity.ServiceItem;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private BigDecimal price;
    private boolean active;
    private Long providerId;
    private String providerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ServiceResponse(ServiceItem service) {
        this.id = service.getId();
        this.title = service.getTitle();
        this.description = service.getDescription();
        this.category = service.getCategory();
        this.price = service.getPrice();
        this.active = service.isActive();
        this.providerId = service.getProvider().getId();
        this.providerName = service.getProvider().getName();
        this.createdAt = service.getCreatedAt();
        this.updatedAt = service.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public boolean isActive() {
        return active;
    }

    public Long getProviderId() {
        return providerId;
    }

    public String getProviderName() {
        return providerName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
