import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../api/authApi";
import useAuthStore from "../../store/authStore";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect về trang trước đó sau khi login
  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(form);
      setAuth({ username: data.username, role: data.role });

      // Redirect theo role
      if (data.role === "ADMIN") {
        navigate("/admin/products", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Sai username hoặc password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-7eleven-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex mb-4 items-stretch shadow-md rounded-lg overflow-hidden border border-white/10">
            <span className="bg-white px-3 py-2 flex items-center justify-center">
              <img src="./Logo_of_7-Eleven.svg.png" alt="7-Eleven Logo" className="h-10 object-contain" />
            </span>
            <span className="bg-white text-7eleven-dark font-black text-4xl px-4 py-2 flex items-center tracking-wider">
              7-Eleven
            </span>
          </div>
          <p className="text-gray-400 mt-2">Chuỗi cửa hàng tiện lợi</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Đăng nhập</h2>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600
                            rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                className="input"
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="input"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !form.username || !form.password}
              className="btn-primary w-full mt-2"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          {/* Hint accounts */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3">
              Tài khoản demo
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setForm({ username: "admin", password: "admin123" })}
                className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200
                           rounded-lg px-3 py-2 transition-colors text-left"
              >
                <p className="font-semibold text-gray-700">👑 Admin</p>
                <p className="text-gray-400">admin / admin123</p>
              </button>
              <button
                onClick={() => setForm({ username: "user", password: "user123" })}
                className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200
                           rounded-lg px-3 py-2 transition-colors text-left"
              >
                <p className="font-semibold text-gray-700">👤 User</p>
                <p className="text-gray-400">user / user123</p>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          © {new Date().getFullYear()} 7-Eleven Vietnam. All rights reserved.
        </p>
      </div>
    </div>
  );
}