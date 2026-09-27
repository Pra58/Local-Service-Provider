package com.Backend.Backend.dto;

public class DashboardStatsResponse {

    private long totalUsers;
    private long totalProviders;
    private long totalServices;
    private long totalBookings;

    public DashboardStatsResponse(long totalUsers, long totalProviders, long totalServices, long totalBookings) {
        this.totalUsers = totalUsers;
        this.totalProviders = totalProviders;
        this.totalServices = totalServices;
        this.totalBookings = totalBookings;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalProviders() {
        return totalProviders;
    }

    public long getTotalServices() {
        return totalServices;
    }

    public long getTotalBookings() {
        return totalBookings;
    }
}
