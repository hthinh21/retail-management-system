import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import { ShoppingCart, LogOut, User, LayoutDashboard } from "lucide-react";
import { logout as logoutApi } from "../../api/authApi";

export default function Navbar({ onCartClick }) {
    const { user, logout } = useAuthStore();
    const totalItems = useCartStore((s) => s.totalItems());
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutApi(); // Xóa httpOnly cookie
        } catch (_) { }
        logout();            // Xóa Zustand store
        navigate("/");
    };

    return (
        <nav className="bg-7eleven-dark text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex">
                        <span className="bg-7eleven-red text-white font-black text-xl px-2 py-1">7</span>
                        <span className="bg-white text-7eleven-dark font-black text-xl px-2 py-1">ELEVEn</span>
                    </div>
                    <span className="text-gray-400 text-sm hidden md:block">Retail Management</span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">

                    {/* Cart */}
                    <button
                        onClick={onCartClick}
                        className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ShoppingCart size={22} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-7eleven-red text-white
                               text-xs font-bold w-5 h-5 rounded-full flex items-center
                               justify-center">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </button>

                    {user ? (
                        <>
                            {user.role === "ADMIN" && (
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-1.5 text-sm hover:bg-white/10
                             px-3 py-2 rounded-lg transition-colors"
                                >
                                    <LayoutDashboard size={16} />
                                    <span className="hidden md:block">Dashboard</span>
                                </Link>
                            )}

                            {user.role === "USER" && (
                                <Link
                                    to="/my-orders"
                                    className="flex items-center gap-1.5 text-sm hover:bg-white/10
                             px-3 py-2 rounded-lg transition-colors"
                                >
                                    <User size={16} />
                                    <span className="hidden md:block">{user.username}</span>
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-sm hover:bg-white/10
                           px-3 py-2 rounded-lg transition-colors text-gray-300"
                            >
                                <LogOut size={16} />
                                <span className="hidden md:block">Đăng xuất</span>
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn-primary text-sm py-1.5">
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}