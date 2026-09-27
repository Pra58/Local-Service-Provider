package com.Backend.Backend.service;

import com.Backend.Backend.dto.DashboardStatsResponse;
import com.Backend.Backend.entity.RoleType;
import com.Backend.Backend.entity.User;
import com.Backend.Backend.exception.BadRequestException;
import com.Backend.Backend.exception.ResourceNotFoundException;
import com.Backend.Backend.repository.BookingRepository;
import com.Backend.Backend.repository.ServiceRepository;
import com.Backend.Backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Read-side aggregation and account-management operations that only make
 * sense for an ADMIN. Kept separate from UserService/ServiceCatalogService/
 * BookingService so those keep their normal ownership-scoped behaviour.
 */
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;

    public AdminService(UserRepository userRepository,
                         ServiceRepository serviceRepository,
                         BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.bookingRepository = bookingRepository;
    }

    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProviders = userRepository.findByRole(RoleType.PROVIDER).size();
        long totalServices = serviceRepository.count();
        long totalBookings = bookingRepository.count();
        return new DashboardStatsResponse(totalUsers, totalProviders, totalServices, totalBookings);
    }

    @Transactional
    public void deleteUser(Long targetUserId, Long requesterId) {
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));

        if (target.getId().equals(requesterId)) {
            throw new BadRequestException("An admin cannot delete their own account");
        }

        if (target.getRole() == RoleType.ADMIN && userRepository.findByRole(RoleType.ADMIN).size() <= 1) {
            throw new BadRequestException("Cannot delete the last remaining admin account");
        }

        userRepository.delete(target);
    }
}
