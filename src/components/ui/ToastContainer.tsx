import React from 'react';
import { Toast, ToastType } from './Toast';

interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full pointer-events-none">
      <div className="space-y-2 pointer-events-auto">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="transform transition-all duration-500 ease-out"
            style={{
              animation: 'slideIn 0.5s ease-out'
            }}
          >
            <Toast toast={toast} onDismiss={onDismiss} />
          </div>
        ))}
      </div>
    </div>
  );
}; 