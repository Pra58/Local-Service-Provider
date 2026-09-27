package com.Backend.Backend.controller;

import com.Backend.Backend.dto.BookingRequest;
import com.Backend.Backend.dto.BookingResponse;
import com.Backend.Backend.dto.BookingStatusUpdateRequest;
import com.Backend.Backend.entity.BookingStatus;
import com.Backend.Backend.entity.User;
import com.Backend.Backend.exception.BadRequestException;
import com.Backend.Backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<BookingResponse> createBooking(@AuthenticationPrincipal User currentUser,
                                                           @Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createBooking(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public BookingResponse getBooking(@AuthenticationPrincipal User currentUser, @PathVariable Long id) {
        return bookingService.getBookingResponse(currentUser, id);
    }

    /** The current user's own bookings, as a customer. */
    @GetMapping("/my")
    public List<BookingResponse> getMyBookings(@AuthenticationPrincipal User currentUser) {
        return bookingService.getMyBookings(currentUser);
    }

    /** Bookings made against the current provider's services. */
    @GetMapping("/provider")
    @PreAuthorize("hasAnyRole('PROVIDER','ADMIN')")
    public List<BookingResponse> getProviderBookings(@AuthenticationPrincipal User currentUser) {
        return bookingService.getProviderBookings(currentUser);
    }

    /** Provider accepts / rejects / completes a booking on their service. */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('PROVIDER','ADMIN')")
    public BookingResponse updateStatus(@AuthenticationPrincipal User currentUser,
                                         @PathVariable Long id,
                                         @Valid @RequestBody BookingStatusUpdateRequest request) {
        BookingStatus newStatus = parseStatus(request.getStatus());
        return bookingService.updateStatus(currentUser, id, newStatus);
    }

    /** The customer cancels their own pending/accepted booking. */
    @PutMapping("/{id}/cancel")
    public BookingResponse cancelBooking(@AuthenticationPrincipal User currentUser, @PathVariable Long id) {
        return bookingService.cancelBooking(currentUser, id);
    }

    private BookingStatus parseStatus(String raw) {
        try {
            return BookingStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(
                    "Status must be one of: PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED");
        }
    }
}
