import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";
import useToastStore from "../../store/toastStore";
import { formatVND } from "../../utils/formatCurrency";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { createOrder } from "../../api/orderApi";
import { useState } from "react";

export default function Cart({ onLoginRequired }) {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } =
    useCartStore();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (items.length === 0) return;

    if(!user){
        onLoginRequired()
        return;
    }
    setLoading(true);
    try {
      await createOrder({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        note,
      });
      clearCart();
      setNote("");
      addToast("Đặt hàng thành công! Cảm ơn bạn đã ủng hộ 7-Eleven.", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-7eleven-red rounded-t-xl">
        <ShoppingCart className="text-white" size={20} />
        <h2 className="text-white font-bold text-lg">Giỏ hàng</h2>
        {totalItems() > 0 && (
          <span className="ml-auto bg-white text-7eleven-red text-xs font-bold
                           px-2 py-0.5 rounded-full">
            {totalItems()}
          </span>
        )}
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-12 text-gray-400">
          <ShoppingCart size={48} strokeWidth={1} />
          <p className="mt-3 text-sm">Chưa có sản phẩm nào</p>
        </div>
      ) : (
        <>
          {/* Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 px-3 py-2">
            {items.map((item) => (
              <div key={item.productId} className="py-3 flex gap-3">
                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-14 h-14 rounded-lg object-cover border border-gray-100"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {item.productName}
                  </p>
                  <p className="text-7eleven-red text-sm font-bold mt-0.5">
                    {formatVND(item.unitPrice)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center
                                 justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center
                                 justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Subtotal + Remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-gray-300 hover:text-7eleven-red transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                  <p className="text-sm font-bold text-gray-700">
                    {formatVND(item.unitPrice * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="px-4 pt-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú đơn hàng..."
              rows={2}
              className="input text-sm resize-none"
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 space-y-3">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Tổng cộng</span>
              <span className="text-7eleven-red font-bold text-lg">
                {formatVND(totalPrice())}
              </span>
            </div>

            {/* Buttons */}
            <button
              onClick={handleOrder}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Đang đặt hàng..." : `Đặt hàng • ${formatVND(totalPrice())}`}
            </button>

            <button
              onClick={clearCart}
              className="w-full text-sm text-gray-400 hover:text-7eleven-red
                         transition-colors text-center"
            >
              Xóa giỏ hàng
            </button>
          </div>
        </>
      )}
    </div>
  );
}