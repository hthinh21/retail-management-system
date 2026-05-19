import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, updateOrderStatus, getOrdersByUsername } from "../../api/orderApi";
import { formatVND } from "../../utils/formatCurrency";
import { getStatusBadge, ORDER_STATUS } from "../../utils/orderStatus";
import { Search, ChevronDown, ChevronUp, Package } from "lucide-react";
import Pagination from "../../components/ui/Pagination";

export default function OrderListPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page, search],
    queryFn: () => search
      ? getOrdersByUsername(search)
      : getAllOrders(page, 10),
    keepPreviousData: true,
  });

  const orders = search ? (data || []) : (data?.content || []);
  const totalPages = search ? 1 : (data?.totalPages || 0);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-orders"]);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(0);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h2>
          <p className="text-gray-500 text-sm mt-1">
            {search
              ? `Đơn hàng của "${search}"`
              : `Tổng ${data?.totalElements || 0} đơn hàng`}
          </p>
        </div>
      </div>

      {/* Search by username */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16} />
          <input
            type="text"
            placeholder="Tìm theo username..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input pl-9 w-64"
          />
        </div>
        <button type="submit" className="btn-primary px-4">
          Tìm
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); setSearchInput(""); }}
            className="btn-outline px-4"
          >
            Xóa lọc
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                Mã đơn
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                Khách hàng
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                Ngày đặt
              </th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">
                Tổng tiền
              </th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">
                Trạng thái
              </th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">
                Cập nhật
              </th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">
                Chi tiết
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400">
                  <Package size={40} className="mx-auto mb-2 opacity-40" />
                  <p>Không có đơn hàng nào</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* ID */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-500">
                        #{String(order.id).slice(0, 8)}
                      </span>
                    </td>

                    {/* Username */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-sm text-gray-800">
                        {order.username}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 text-right font-bold text-7eleven-red">
                      {formatVND(order.totalPrice)}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3 text-center">
                      <span className={getStatusBadge(order.status).badge}>
                        {getStatusBadge(order.status).label}
                      </span>
                    </td>

                    {/* Status update */}
                    <td className="px-4 py-3 text-center">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          statusMutation.mutate({
                            id: order.id,
                            status: e.target.value,
                          })
                        }
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5
                                   focus:outline-none focus:ring-2 focus:ring-7eleven-red
                                   bg-white cursor-pointer"
                      >
                        {Object.entries(ORDER_STATUS).map(([key, val]) => (
                          <option key={key} value={key}>
                            {val.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Expand */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.id ? null : order.id
                          )
                        }
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors
                                   text-gray-500"
                      >
                        {expandedOrder === order.id
                          ? <ChevronUp size={16} />
                          : <ChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded order items */}
                  {expandedOrder === order.id && (
                    <tr key={`${order.id}-detail`}>
                      <td colSpan={7} className="px-4 py-3 bg-gray-50">
                        <div className="space-y-2">
                          {order.note && (
                            <p className="text-xs text-gray-500 italic mb-2">
                              Ghi chú: {order.note}
                            </p>
                          )}
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 bg-white
                                         rounded-lg p-3 border border-gray-100"
                            >
                              <img
                                src={item.productImageUrl}
                                alt={item.productName}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {formatVND(item.unitPrice)} x {item.quantity}
                                </p>
                              </div>
                              <p className="font-bold text-7eleven-red text-sm">
                                {formatVND(item.subtotal)}
                              </p>
                            </div>
                          ))}
                          <div className="flex justify-end pt-1">
                            <p className="text-sm font-bold text-gray-800">
                              Tổng: {formatVND(order.totalPrice)}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}