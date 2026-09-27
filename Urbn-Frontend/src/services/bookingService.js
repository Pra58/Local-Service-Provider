import api from "./api";

export const createBooking = (payload) => api.post("/bookings", payload).then((r) => r.data);

export const getMyBookings = () => api.get("/bookings/my").then((r) => r.data);

export const getProviderBookings = () => api.get("/bookings/provider").then((r) => r.data);

export const getBookingById = (id) => api.get(`/bookings/${id}`).then((r) => r.data);

export const updateBookingStatus = (id, status) =>
  api.put(`/bookings/${id}/status`, { status }).then((r) => r.data);

export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`).then((r) => r.data);
