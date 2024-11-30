import React, { useEffect } from 'react';
import { useConfig } from '../../contexts/ConfigContext';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'error':
      return (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    case 'warning':
      return (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'info':
      return (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
  }
};

const getStyles = (type: ToastType, isDark: boolean) => {
  const baseStyles = isDark
    ? 'bg-gray-800/90 border text-white'
    : 'bg-white/90 border text-gray-900';

  const typeStyles = {
    success: isDark
      ? 'border-green-500/50 text-green-400'
      : 'border-green-500/50 text-green-600',
    error: isDark
      ? 'border-red-500/50 text-red-400'
      : 'border-red-500/50 text-red-600',
    warning: isDark
      ? 'border-yellow-500/50 text-yellow-400'
      : 'border-yellow-500/50 text-yellow-600',
    info: isDark
      ? 'border-blue-500/50 text-blue-400'
      : 'border-blue-500/50 text-blue-600'
  };

  return `${baseStyles} ${typeStyles[type]}`;
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        transform transition-all duration-300 ease-out
        ${getStyles(toast.type, isDark)}
      `}
      role="alert"
    >
      <span className="flex-shrink-0">
        {getIcon(toast.type)}
      </span>
      <p className="text-sm font-medium">
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className={`
          ml-auto flex-shrink-0 rounded-lg p-1
          transition-colors duration-200
          ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
        `}
      >
        <svg 
          className="w-4 h-4 opacity-60" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
    </div>
  );
}; 