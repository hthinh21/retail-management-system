import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../../api/orderApi";
import { formatVND } from "../../utils/formatCurrency";
import { getStatusBadge } from "../../utils/orderStatus";
import Navbar from "../../components/layout/Navbar";
import { ChevronDown, ChevronUp, Package } from "lucide-react";

export default function MyOrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => getMyOrders(0, 20),
  });

  const orderList = orders?.content || orders;

  return (
    <div className="min-h-screen bg-7eleven-light">
      <Navbar onCartClick={() => setCartOpen(!cartOpen)} />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Đơn hàng của tôi
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-24 animate-pulse" />
            ))}
          </div>
        ) : orderList.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package size={56} strokeWidth={1} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-semibold">Chưa có đơn hàng nào</p>
            <p className="text-sm mt-1">Hãy đặt hàng ngay!</p>
            <a href="/" className="btn-primary inline-block mt-4">
              Mua sắm ngay
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {orderList.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">

                {/* Order header */}
                <div
                  className="flex items-center justify-between px-4 py-4 cursor-pointer
                               hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpandedOrder(expandedOrder === order.id ? null : order.id)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-mono text-xs text-gray-400">
                        #{String(order.id).slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <span className={getStatusBadge(order.status).badge}>
                      {getStatusBadge(order.status).label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-7eleven-red">
                      {formatVND(order.totalPrice)}
                    </span>
                    {expandedOrder === order.id
                      ? <ChevronUp size={16} className="text-gray-400" />
                      : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>

                {/* Order items */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                    {order.note && (
                      <p className="text-xs text-gray-500 italic mb-3">
                        {order.note}
                      </p>
                    )}
                    {order.items.map((item) => (
                      <div key={item.id}
                        className="flex items-center gap-3 py-2">
                        <img
                          src={item.productImageUrl}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatVND(item.unitPrice)} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-sm text-gray-700">
                          {formatVND(item.subtotal)}
                        </p>
                      </div>
                    ))}
                    <div className="flex justify-end pt-2 border-t border-gray-100">
                      <p className="font-bold text-7eleven-red">
                        Tổng: {formatVND(order.totalPrice)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}