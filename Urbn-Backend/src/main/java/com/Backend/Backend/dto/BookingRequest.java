package com.Backend.Backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class BookingRequest {

    @NotNull(message = "Service id is required")
    private Long serviceId;

    private LocalDateTime scheduledAt;

    private String address;

    private String notes;

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
