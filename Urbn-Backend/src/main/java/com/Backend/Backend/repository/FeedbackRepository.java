package com.Backend.Backend.repository;

import com.Backend.Backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByServiceItemId(Long serviceId);

    Optional<Feedback> findByBookingId(Long bookingId);

    boolean existsByBookingId(Long bookingId);
}
