package com.Backend.Backend.service;

import com.Backend.Backend.dto.BookingRequest;
import com.Backend.Backend.dto.BookingResponse;
import com.Backend.Backend.entity.Booking;
import com.Backend.Backend.entity.BookingStatus;
import com.Backend.Backend.entity.RoleType;
import com.Backend.Backend.entity.ServiceItem;
import com.Backend.Backend.entity.User;
import com.Backend.Backend.exception.BadRequestException;
import com.Backend.Backend.exception.ForbiddenException;
import com.Backend.Backend.exception.ResourceNotFoundException;
import com.Backend.Backend.repository.BookingRepository;
import com.Backend.Backend.repository.ServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;

    /** Legal status transitions, keyed by the current status. */
    private static final Map<BookingStatus, Set<BookingStatus>> ALLOWED_TRANSITIONS = Map.of(
            BookingStatus.PENDING, EnumSet.of(BookingStatus.ACCEPTED, BookingStatus.REJECTED, BookingStatus.CANCELLED),
            BookingStatus.ACCEPTED, EnumSet.of(BookingStatus.COMPLETED, BookingStatus.CANCELLED),
            BookingStatus.REJECTED, EnumSet.noneOf(BookingStatus.class),
            BookingStatus.COMPLETED, EnumSet.noneOf(BookingStatus.class),
            BookingStatus.CANCELLED, EnumSet.noneOf(BookingStatus.class)
    );

    public BookingService(BookingRepository bookingRepository, ServiceRepository serviceRepository) {
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional
    public BookingResponse createBooking(User user, BookingRequest request) {
        ServiceItem service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + request.getServiceId()));

        if (!service.isActive()) {
            throw new BadRequestException("This service is not currently available for booking");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setServiceItem(service);
        booking.setScheduledAt(request.getScheduledAt());
        booking.setAddress(request.getAddress());
        booking.setNotes(request.getNotes());
        booking.setStatus(BookingStatus.PENDING);

        return new BookingResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingResponse(User requester, Long bookingId) {
        Booking booking = getBookingOrThrow(bookingId);
        assertCanView(requester, booking);
        return new BookingResponse(booking);
    }

    public Booking getBookingOrThrow(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(User user) {
        return bookingRepository.findByUserId(user.getId()).stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getProviderBookings(User provider) {
        return bookingRepository.findByServiceItem_Provider_Id(provider.getId()).stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookingsAdmin() {
        return bookingRepository.findAll().stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse updateStatus(User requester, Long bookingId, BookingStatus newStatus) {
        Booking booking = getBookingOrThrow(bookingId);

        boolean isProviderOwner = booking.getServiceItem().getProvider().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == RoleType.ADMIN;

        if (!isProviderOwner && !isAdmin) {
            throw new ForbiddenException("Only the service provider (or an admin) can update this booking's status");
        }

        applyTransition(booking, newStatus);
        return new BookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse cancelBooking(User requester, Long bookingId) {
        Booking booking = getBookingOrThrow(bookingId);

        boolean isOwner = booking.getUser().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == RoleType.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("Only the user who made this booking (or an admin) can cancel it");
        }

        applyTransition(booking, BookingStatus.CANCELLED);
        return new BookingResponse(bookingRepository.save(booking));
    }

    private void applyTransition(Booking booking, BookingStatus newStatus) {
        BookingStatus current = booking.getStatus();
        Set<BookingStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(current, EnumSet.noneOf(BookingStatus.class));

        if (!allowed.contains(newStatus)) {
            throw new BadRequestException(
                    "Cannot move booking from status " + current + " to " + newStatus);
        }
        booking.setStatus(newStatus);
    }

    private void assertCanView(User requester, Booking booking) {
        boolean isCustomer = booking.getUser().getId().equals(requester.getId());
        boolean isProviderOwner = booking.getServiceItem().getProvider().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == RoleType.ADMIN;

        if (!isCustomer && !isProviderOwner && !isAdmin) {
            throw new ForbiddenException("You do not have access to this booking");
        }
    }
}
