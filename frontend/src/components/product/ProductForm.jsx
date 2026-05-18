import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { formatVND } from "../../utils/formatCurrency";

const CATEGORIES = [
  "Đồ uống",
  "Thức ăn",
  "Snack",
  "Mì & Cháo",
  "Kem & Bánh",
  "Chăm sóc cá nhân",
  "Khác",
];

const defaultForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "Đồ uống",
  imageUrl: "",
};

export default function ProductForm({ product, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  // Nếu edit thì fill data vào form
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || "Đồ uống",
        imageUrl: product.imageUrl || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [product]);

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Tên sản phẩm không được để trống";
    if (!form.price || form.price <= 0) err.price = "Giá phải lớn hơn 0";
    if (form.stock === "" || form.stock < 0) err.stock = "Số lượng không được âm";
    if (!form.category) err.category = "Vui lòng chọn danh mục";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh]
                      overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b
                        border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-800">
            {product ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">

          {/* Image preview */}
          {form.imageUrl && (
            <div className="flex justify-center">
              <img
                src={form.imageUrl}
                alt="preview"
                className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="VD: Cà phê Americano"
              className={`input ${errors.name ? "border-red-400 ring-1 ring-red-400" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Mô tả ngắn về sản phẩm..."
              rows={2}
              className="input resize-none"
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Giá (VND) <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="VD: 29000"
                min="0"
                className={`input ${errors.price ? "border-red-400 ring-1 ring-red-400" : ""}`}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
              {form.price > 0 && (
                <p className="text-gray-400 text-xs mt-1">
                  {formatVND(form.price)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Số lượng <span className="text-red-500">*</span>
              </label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="VD: 100"
                min="0"
                className={`input ${errors.stock ? "border-red-400 ring-1 ring-red-400" : ""}`}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`input ${errors.category ? "border-red-400 ring-1 ring-red-400" : ""}`}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              URL hình ảnh
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="input"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-outline"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading
                ? "Đang lưu..."
                : product
                ? "Lưu thay đổi"
                : "Thêm sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}