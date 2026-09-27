package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Booking;

import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private Long serviceId;
    private String serviceTitle;
    private Long userId;
    private String userName;
    private Long providerId;
    private String providerName;
    private String status;
    private LocalDateTime scheduledAt;
    private String address;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BookingResponse(Booking booking) {
        this.id = booking.getId();
        this.serviceId = booking.getServiceItem().getId();
        this.serviceTitle = booking.getServiceItem().getTitle();
        this.userId = booking.getUser().getId();
        this.userName = booking.getUser().getName();
        this.providerId = booking.getServiceItem().getProvider().getId();
        this.providerName = booking.getServiceItem().getProvider().getName();
        this.status = booking.getStatus().name();
        this.scheduledAt = booking.getScheduledAt();
        this.address = booking.getAddress();
        this.notes = booking.getNotes();
        this.createdAt = booking.getCreatedAt();
        this.updatedAt = booking.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public String getServiceTitle() {
        return serviceTitle;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public Long getProviderId() {
        return providerId;
    }

    public String getProviderName() {
        return providerName;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public String getAddress() {
        return address;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
