import React, { createContext, useContext, useCallback, useState } from 'react';
import { Toast, ToastType } from '../components/ui/Toast';

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message, duration }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full pointer-events-none">
        <div className="space-y-2 pointer-events-auto">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className="transform transition-all duration-500 ease-out"
              style={{
                animation: 'slideIn 0.5s ease-out'
              }}
            >
              <Toast toast={toast} onDismiss={dismissToast} />
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

// Add animation keyframes to the global styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style); 