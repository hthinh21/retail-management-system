import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);
  const showPages = pages.filter(
    (p) => p === 0 || p === totalPages - 1 ||
           Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40
                   disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      {showPages.map((p, idx) => (
        <div key={p} className="flex items-center">
          {idx > 0 && showPages[idx - 1] !== p - 1 && (
            <span className="px-2 text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
              p === page
                ? "bg-7eleven-red text-white"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {p + 1}
          </button>
        </div>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40
                   disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}