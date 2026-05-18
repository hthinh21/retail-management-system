import api from "./axios";

// User
export const getActiveProducts = () =>
  api.get("/products").then((r) => r.data);

export const getProductById = (id) =>
  api.get(`/products/${id}`).then((r) => r.data);

// Admin
export const getAllProducts = () =>
  api.get("/admin/products").then((r) => r.data);

export const createProduct = (data) =>
  api.post("/admin/products", data).then((r) => r.data);

export const updateProduct = (id, data) =>
  api.put(`/admin/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id) =>
  api.delete(`/admin/products/${id}`).then((r) => r.data);