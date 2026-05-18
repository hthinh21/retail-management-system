import { Plus, ShoppingBag } from "lucide-react";
import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";
import { formatVND } from "../../utils/formatCurrency";

export default function ProductCard({ product, onLoginRequired }) {
  const { addItem, items } = useCartStore();
  const { token } = useAuthStore();

  const cartItem = items.find((i) => i.productId === product.id);
  const inCart = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem(product);
  };

  return (
    <div className="card flex flex-col group cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img
          src={product.imageUrl || "https://placehold.co/300x300?text=No+Image"}
          alt={product.name}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center
                          rounded-lg">
            <span className="text-white text-sm font-semibold">Hết hàng</span>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-2 left-2 bg-7eleven-green text-white text-xs
                         px-2 py-0.5 rounded-full font-medium">
          {product.category}
        </span>

        {/* In cart badge */}
        {inCart > 0 && (
          <span className="absolute top-2 right-2 bg-7eleven-red text-white text-xs
                           font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {inCart}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-gray-400 text-xs mt-1 line-clamp-1">
            {product.description}
          </p>
        )}
      </div>

      {/* Price + Add button */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-7eleven-red font-bold">
          {formatVND(product.price)}
        </span>

        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg
                      font-semibold transition-colors
                      ${product.stock === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : inCart > 0
                          ? "bg-7eleven-red text-white"
                          : "bg-7eleven-dark text-white hover:bg-gray-700"
                      }`}
        >
          <Plus size={14} />
          {inCart > 0 ? "Thêm" : "Chọn"}
        </button>
      </div>

      {/* Stock warning */}
      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-orange-500 text-xs mt-1.5 font-medium">
          ⚠️ Chỉ còn {product.stock} sản phẩm
        </p>
      )}
    </div>
  );
}