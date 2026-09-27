import api from "./api";

export const getFeedbackForService = (serviceId) =>
  api.get(`/feedback/service/${serviceId}`).then((r) => r.data);

export const addFeedback = (payload) => api.post("/feedback", payload).then((r) => r.data);
