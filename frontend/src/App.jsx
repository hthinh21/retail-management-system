import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "./store/authStore";

const queryClient = new QueryClient();

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import ProductListPage from "./pages/admin/ProductListPage";
import OrderListPage from "./pages/admin/OrderListPage";
import UserLayout from "./pages/user/UserLayout";
import MyOrdersPage from "./pages/user/MyOrdersPage";

import ToastContainer from "./components/ui/Toast";

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user?.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Public — không cần login */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* User — cần login */}
          <Route path="/" element={<UserLayout />}>
            <Route path="my-orders" element={<MyOrdersPage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="orders" element={<OrderListPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
