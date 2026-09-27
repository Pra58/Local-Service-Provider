package com.Backend.Backend.controller;

import com.Backend.Backend.dto.BookingResponse;
import com.Backend.Backend.dto.DashboardStatsResponse;
import com.Backend.Backend.dto.MessageResponse;
import com.Backend.Backend.dto.ServiceResponse;
import com.Backend.Backend.dto.UserResponse;
import com.Backend.Backend.dto.UserRoleUpdateRequest;
import com.Backend.Backend.entity.User;
import com.Backend.Backend.service.AdminService;
import com.Backend.Backend.service.BookingService;
import com.Backend.Backend.service.ServiceCatalogService;
import com.Backend.Backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only aggregated views over users, providers, services and bookings.
 * Every endpoint here requires the ADMIN role; ordinary create/update/delete
 * of a specific resource still goes through that resource's own controller
 * (UserController, ServiceController, BookingController), which also allow
 * ADMIN to act on records it doesn't own.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final ServiceCatalogService serviceCatalogService;
    private final BookingService bookingService;
    private final AdminService adminService;

    public AdminController(UserService userService,
                            ServiceCatalogService serviceCatalogService,
                            BookingService bookingService,
                            AdminService adminService) {
        this.userService = userService;
        this.serviceCatalogService = serviceCatalogService;
        this.bookingService = bookingService;
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public DashboardStatsResponse getDashboardStats() {
        return adminService.getDashboardStats();
    }

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.getUserResponse(id);
    }

    @PutMapping("/users/{id}/role")
    public UserResponse updateUserRole(@PathVariable Long id, @Valid @RequestBody UserRoleUpdateRequest request) {
        return userService.updateUserRole(id, request);
    }

    @GetMapping("/providers")
    public List<UserResponse> getAllProviders() {
        return userService.getAllProviders();
    }

    @DeleteMapping("/users/{id}")
    public MessageResponse deleteUser(@AuthenticationPrincipal User currentUser, @PathVariable Long id) {
        adminService.deleteUser(id, currentUser.getId());
        return new MessageResponse("User deleted successfully");
    }

    @GetMapping("/services")
    public List<ServiceResponse> getAllServices() {
        return serviceCatalogService.getAllServicesAdmin();
    }

    @GetMapping("/bookings")
    public List<BookingResponse> getAllBookings() {
        return bookingService.getAllBookingsAdmin();
    }
}
