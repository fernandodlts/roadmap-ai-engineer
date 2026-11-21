import { X } from 'lucide-react';
import type { ToastItem, ToastVariant } from '../../types/roadmap';

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  indigo: 'bg-slate-900 border-indigo-500/50 text-indigo-100',
  emerald: 'bg-slate-900 border-emerald-500/50 text-emerald-100',
  rose: 'bg-slate-900 border-rose-500/50 text-rose-100',
  amber: 'bg-slate-900 border-amber-500/50 text-amber-100',
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto px-4 py-3 rounded-xl border shadow-2xl text-xs sm:text-sm font-medium flex items-center justify-between gap-3 tab-fade ${VARIANT_CLASSES[toast.variant]}`}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Fechar notificação"
            className="opacity-70 hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
