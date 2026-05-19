import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProducts, createProduct,
  updateProduct, deleteProduct
} from "../../api/productApi";
import ProductForm from "../../components/product/ProductForm";
import { formatVND } from "../../utils/formatCurrency";
import { Plus, Pencil, Trash2, Search, PackageX } from "lucide-react";
import Pagination from "../../components/ui/Pagination";

export default function ProductListPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", page],
    queryFn: () => getAllProducts(page, 10),
    keepPreviousData: true,
  });

  const products = data?.content || [];
  const totalPages = data?.totalPages || 0;

  // Filter search client-side
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Mutations
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-products"]);
      queryClient.invalidateQueries(["products"]);
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-products"]);
      queryClient.invalidateQueries(["products"]);
      setModalOpen(false);
      setEditProduct(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-products"]);
      queryClient.invalidateQueries(["products"]);
      setDeleteConfirm(null);
    },
  });

  const handleSubmit = (formData) => {
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditProduct(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h2>
          <p className="text-gray-500 text-sm mt-1">
            Tổng {data?.totalElements || 0} sản phẩm
          </p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Thêm sản phẩm
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16} />
        <input
          type="text"
          placeholder="Tìm tên sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9 max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                Sản phẩm
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                Danh mục
              </th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">
                Giá
              </th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">
                Tồn kho
              </th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">
                Trạng thái
              </th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-gray-400">
                  <PackageX size={40} className="mx-auto mb-2 opacity-40" />
                  <p>Không có sản phẩm nào</p>
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  {/* Product */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl ||
                          "https://placehold.co/48x48?text=?"}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {product.name}
                        </p>
                        <p className="text-gray-400 text-xs line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="bg-green-50 text-green-700 text-xs font-semibold
                                     px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-right font-bold text-7eleven-red">
                    {formatVND(product.price)}
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold text-sm ${
                      product.stock === 0
                        ? "text-red-500"
                        : product.stock <= 5
                        ? "text-orange-500"
                        : "text-gray-700"
                    }`}>
                      {product.stock}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      product.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {product.active ? "Đang bán" : "Ngừng bán"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg
                                   transition-colors"
                        title="Sửa"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product)}
                        className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg
                                   transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Product Form Modal */}
      {modalOpen && (
        <ProductForm
          product={editProduct}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center
                              justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Xóa sản phẩm?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Bạn có chắc muốn xóa{" "}
                <span className="font-semibold text-gray-800">
                  {deleteConfirm.name}
                </span>
                ? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 btn-outline"
                >
                  Hủy
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteConfirm.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg
                             font-semibold hover:bg-red-600 transition-colors
                             disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}