import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/layout/Navbar";
import Cart from "../components/cart/Cart";
import ProductCard from "../components/product/ProductCard";
import { getActiveProducts } from "../api/productApi";
import { Search } from "lucide-react";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  // React Query cache 5 phút
  const { data: pageData, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getActiveProducts,
  });

  const products = pageData?.content || [];

  // Derived state — không cần useEffect
  const categories = ["Tất cả", ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchCat =
      selectedCategory === "Tất cả" || p.category === selectedCategory;
    const matchSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-7eleven-light">
      <Navbar onCartClick={() => setCartOpen(!cartOpen)} />

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-7eleven-dark via-gray-900 to-7eleven-dark
                      text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg flex items-center justify-center shadow-md">
              <img src="/logo.svg" alt="7-Eleven Logo" className="h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-wider leading-none">
                <span className="text-white">7-Eleven</span>
                <span className="text-7eleven-orange"> Store</span>
              </h1>
              <p className="text-gray-400 mt-1.5 text-sm">Đặt hàng nhanh, giao tận nơi</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-4 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20
                         rounded-xl text-white placeholder-gray-400 focus:outline-none
                         focus:ring-2 focus:ring-7eleven-red"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold
                              whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-7eleven-red text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product count */}
            <p className="text-gray-500 text-sm mt-4 mb-3">
              {filtered.length} sản phẩm
            </p>

            {/* Loading skeleton */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-56 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-5xl mb-3">🔍</p>
                <p>Không tìm thấy sản phẩm</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onLoginRequired={() => navigate("/login")}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart sidebar — desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <Cart onLoginRequired={() => navigate("/login")} />
            </div>
          </div>
        </div>
      </div>

      {/* Cart drawer — mobile */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl">
            <Cart
              onLoginRequired={() => {
                setCartOpen(false);
                navigate("/login");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}