import api from "./api";

export const getDashboardStats = () => api.get("/admin/dashboard").then((r) => r.data);

export const getAllUsers = () => api.get("/admin/users").then((r) => r.data);

export const getAllProviders = () => api.get("/admin/providers").then((r) => r.data);

export const getAllServicesAdmin = () => api.get("/admin/services").then((r) => r.data);

export const getAllBookingsAdmin = () => api.get("/admin/bookings").then((r) => r.data);

export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role }).then((r) => r.data);

export const deleteUserAdmin = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);
