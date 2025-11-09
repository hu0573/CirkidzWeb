import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type ToastType = 'success' | 'error';

export type ToastOptions = {
  type?: ToastType;
  message: string;
};

type ToastRecord = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  addToast: (options: ToastOptions) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef<Record<number, number>>({});

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const addToast = useCallback((options: ToastOptions) => {
    const id = Date.now();
    const toast: ToastRecord = {
      id,
      type: options.type ?? 'success',
      message: options.message,
    };
    setToasts((prev) => [...prev, toast]);
    timers.current[id] = window.setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  const contextValue = useMemo(
    () => ({
      addToast,
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
        <div className="flex w-full max-w-sm flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-lg ${
                toast.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <span>{toast.message}</span>
                <button
                  type="button"
                  className="ml-3 text-xs text-slate-500 hover:text-slate-700"
                  onClick={() => removeToast(toast.id)}
                >
                  Close
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;

