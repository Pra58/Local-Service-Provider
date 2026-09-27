package com.Backend.Backend.service;

import com.Backend.Backend.dto.FeedbackRequest;
import com.Backend.Backend.dto.FeedbackResponse;
import com.Backend.Backend.entity.Booking;
import com.Backend.Backend.entity.BookingStatus;
import com.Backend.Backend.entity.Feedback;
import com.Backend.Backend.entity.User;
import com.Backend.Backend.exception.BadRequestException;
import com.Backend.Backend.exception.DuplicateResourceException;
import com.Backend.Backend.exception.ForbiddenException;
import com.Backend.Backend.exception.ResourceNotFoundException;
import com.Backend.Backend.repository.BookingRepository;
import com.Backend.Backend.repository.FeedbackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final BookingRepository bookingRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, BookingRepository bookingRepository) {
        this.feedbackRepository = feedbackRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public FeedbackResponse addFeedback(User user, FeedbackRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + request.getBookingId()));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only leave feedback for your own bookings");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Feedback can only be left for completed bookings");
        }

        if (feedbackRepository.existsByBookingId(booking.getId())) {
            throw new DuplicateResourceException("Feedback has already been submitted for this booking");
        }

        Feedback feedback = new Feedback();
        feedback.setBooking(booking);
        feedback.setUser(user);
        feedback.setServiceItem(booking.getServiceItem());
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());

        return new FeedbackResponse(feedbackRepository.save(feedback));
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> getFeedbackForService(Long serviceId) {
        return feedbackRepository.findByServiceItemId(serviceId).stream()
                .map(FeedbackResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FeedbackResponse getFeedbackById(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + id));
        return new FeedbackResponse(feedback);
    }
}