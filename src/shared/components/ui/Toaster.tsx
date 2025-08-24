// src/shared/components/ui/Toaster.tsx
import { useEffect } from 'react';
import useToastStore from './toast';
import type { ToastMessage }  from './toast';

const toastStyles = {
  success: 'bg-green-50 border-green-600 text-green-900',
  error: 'bg-red-50 border-red-600  text-red-900',
  info: 'bg-blue-50 border-blue-600  text-blue-900',
  warning: 'bg-yellow-100 border-yellow-600  text-yellow-900',
};

const Toast = ({ id, message, variant }: ToastMessage) => {
  const dismiss = useToastStore((s) => s.dismissToast);

  useEffect(() => {
    const timer = setTimeout(() => dismiss(id), 5000);
    return () => clearTimeout(timer);
  }, [id, dismiss]);

  return (
    <div
      className={`p-4 mb-4 text-sm border-l-4 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 rounded-sm ${toastStyles[variant]}`}
      role="alert"
    >
      <span className="font-medium">{message}</span>
    </div>
  );
};

export const Toaster = () => {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-5 right-5 z-50 w-full max-w-xs space-y-2">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} />
      ))}
    </div>
  );
};