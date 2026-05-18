import api from "./axios";

// User
export const createOrder = (data) => api.post("/orders", data);
export const getMyOrders = () => api.get("/orders/my");
export const getOrderById = (id) => api.get(`/orders/${id}`);

// Admin
export const getAllOrders = () => api.get("/admin/orders");
export const getOrdersByUsername = (username) => api.get(`/admin/orders/user/${username}`);
export const updateOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/status`, { status });