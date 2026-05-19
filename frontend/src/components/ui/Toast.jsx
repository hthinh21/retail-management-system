import useToastStore from "../../store/toastStore";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-xl
                     border backdrop-blur-md transition-all duration-300 animate-slide-in
                     ${
                       t.type === "success"
                         ? "bg-green-600/95 border-green-700/20 text-white"
                         : "bg-red-500/95 border-red-600/20 text-white"
                     }`}
        >
          {t.type === "success" ? (
            <CheckCircle2 className="shrink-0 text-white" size={20} />
          ) : (
            <AlertCircle className="shrink-0 text-white" size={20} />
          )}
          <p className="text-sm font-semibold flex-1 leading-snug">{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className="hover:bg-white/20 p-1 rounded-lg transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
