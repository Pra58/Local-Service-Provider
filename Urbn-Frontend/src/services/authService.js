import api from "./api";

export const registerUser = (payload) => api.post("/auth/register", payload).then((r) => r.data);

export const loginUser = (payload) => api.post("/auth/login", payload).then((r) => r.data);

export const getCurrentUser = () => api.get("/users/me").then((r) => r.data);

export const updateCurrentUser = (payload) => api.put("/users/me", payload).then((r) => r.data);
