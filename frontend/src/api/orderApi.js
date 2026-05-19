import api from "./axios";

// User
export const createOrder = (data) => api.post("/orders", data).then((r) => r.data);
export const getMyOrders = (page = 0, size = 10) =>
  api.get(`/orders/my?page=${page}&size=${size}`).then((r) => r.data);
export const getOrderById = (id) => api.get(`/orders/${id}`).then((r) => r.data);

// Admin
export const getAllOrders = (page = 0, size = 10) =>
  api.get(`/admin/orders?page=${page}&size=${size}`).then((r) => r.data);
export const getOrdersByUsername = (username) => api.get(`/admin/orders/user/${username}`).then((r) => r.data);
export const updateOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/status`, { status }).then((r) => r.data);