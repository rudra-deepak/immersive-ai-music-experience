import React from 'react';
import { Sparkles, Info, AlertTriangle, CheckCircle2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'custom';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#12141a]/95 border border-white/10 backdrop-blur-xl rounded-xl p-4 shadow-2xl transition-all duration-300 animate-float flex items-start gap-3 text-[#e4e2dd]"
        >
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/90">
            {toast.type === 'custom' && <Sparkles className="w-4 h-4 text-amber-300" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-medium text-sm text-white tracking-wide">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs text-white/60 font-sans mt-0.5 leading-relaxed">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-white/40 hover:text-white transition-colors p-1"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
