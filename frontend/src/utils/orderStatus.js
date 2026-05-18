export const ORDER_STATUS = {
  PENDING:   { label: "Chờ xác nhận", badge: "badge-pending" },
  CONFIRMED: { label: "Đã xác nhận",  badge: "badge-confirmed" },
  PAID:      { label: "Đã thanh toán", badge: "badge-paid" },
  SHIPPING:  { label: "Đang giao",    badge: "badge-shipping" },
  DELIVERED: { label: "Đã giao",      badge: "badge-delivered" },
  CANCELLED: { label: "Đã hủy",       badge: "badge-cancelled" },
};

export const getStatusBadge = (status) => {
  return ORDER_STATUS[status] || { label: status, badge: "" };
};