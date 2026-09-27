package com.Backend.Backend.repository;

import com.Backend.Backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByServiceItem_Provider_Id(Long providerId);

    List<Booking> findByServiceItemId(Long serviceId);
}
