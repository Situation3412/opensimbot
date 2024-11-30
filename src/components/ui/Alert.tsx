import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  onClose,
  className = ''
}) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const variantStyles = {
    info: isDark
      ? 'bg-blue-900 border-blue-800 text-blue-200'
      : 'bg-blue-100 border-blue-200 text-blue-900',
    success: isDark
      ? 'bg-green-900 border-green-800 text-green-200'
      : 'bg-green-100 border-green-200 text-green-900',
    warning: isDark
      ? 'bg-yellow-900 border-yellow-800 text-yellow-200'
      : 'bg-yellow-100 border-yellow-200 text-yellow-900',
    error: isDark
      ? 'bg-red-900 border-red-800 text-red-200'
      : 'bg-red-100 border-red-200 text-red-900'
  };

  return (
    <div className={`
      p-4 rounded-lg border
      ${variantStyles[variant]}
      ${className}
    `}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {children}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-4 hover:opacity-75 transition-opacity`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}; 