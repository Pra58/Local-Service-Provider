import api from "./api";

export const getAllServices = (params) => api.get("/services", { params }).then((r) => r.data);

export const getServiceById = (id) => api.get(`/services/${id}`).then((r) => r.data);

export const getMyServices = () => api.get("/services/my").then((r) => r.data);

export const createService = (payload) => api.post("/services", payload).then((r) => r.data);

export const updateService = (id, payload) => api.put(`/services/${id}`, payload).then((r) => r.data);

export const deleteService = (id) => api.delete(`/services/${id}`).then((r) => r.data);

export const setServiceActive = (id, active) =>
  api.patch(`/services/${id}/active`, null, { params: { active } }).then((r) => r.data);

// Kept separate from getAllServices so a single service view doesn't need
// to know about the catalog's filter params.
