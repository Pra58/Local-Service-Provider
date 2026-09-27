package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Feedback;

import java.time.LocalDateTime;

public class FeedbackResponse {

    private Long id;
    private Long bookingId;
    private Long serviceId;
    private String serviceTitle;
    private Long userId;
    private String userName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public FeedbackResponse(Feedback feedback) {
        this.id = feedback.getId();
        this.bookingId = feedback.getBooking().getId();
        this.serviceId = feedback.getServiceItem().getId();
        this.serviceTitle = feedback.getServiceItem().getTitle();
        this.userId = feedback.getUser().getId();
        this.userName = feedback.getUser().getName();
        this.rating = feedback.getRating();
        this.comment = feedback.getComment();
        this.createdAt = feedback.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public Long getBookingId() {
        return bookingId;
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

    public Integer getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
