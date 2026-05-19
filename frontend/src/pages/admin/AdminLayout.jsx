import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { logout as logoutApi } from "../../api/authApi";

const navItems = [
  { to: "/admin/products", icon: Package, label: "Sản phẩm" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Đơn hàng" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logoutApi(); } catch (_) {}
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-7eleven-light">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-7eleven-dark text-white
                         flex flex-col transform transition-transform duration-200
                         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                         lg:relative lg:translate-x-0`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 group">
            <div className="bg-white p-1 rounded-md flex items-center justify-center shadow-md">
              <img src="/logo.svg" alt="7-Eleven Logo" className="h-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg leading-none tracking-wider text-white group-hover:text-7eleven-orange transition-colors">
                7-Eleven
              </span>
              <span className="text-gray-400 text-[10px] tracking-wider leading-none mt-0.5">
                Retail Management
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-xs text-gray-400">Đăng nhập với</p>
          <p className="font-semibold">{user?.username}</p>
          <span className="text-xs bg-7eleven-red px-2 py-0.5 rounded-full">
            {user?.role}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-xs text-gray-500 uppercase font-semibold px-3 mb-2">
            Quản lý
          </p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                 transition-colors ${
                  isActive
                    ? "bg-7eleven-red text-white"
                    : "text-gray-300 hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                       font-medium text-gray-300 hover:bg-white/10 w-full transition-colors"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3
                           flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <LayoutDashboard size={18} className="text-7eleven-red" />
          <h1 className="font-bold text-gray-800">Admin Dashboard</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}