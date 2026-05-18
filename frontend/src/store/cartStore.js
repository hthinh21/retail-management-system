import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [],
  addItem: (product) => {
    const items = get().items;
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
        return;
      }
      set({
        items: items.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      if (product.stock <= 0) {
        alert("Sản phẩm đã hết hàng!");
        return;
      }
      set({
        items: [
          ...items,
          {
            productId: product.id,
            productName: product.name,
            imageUrl: product.imageUrl,
            quantity: 1,
            unitPrice: product.price,
          },
        ],
      });
    }
  },
  removeItem: (productId) => {
    set({
      items: get().items.filter((i) => i.productId !== productId),
    });
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    });
  },
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: () => get().items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
}));

export default useCartStore;
