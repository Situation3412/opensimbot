import React from 'react';
import { useConfig } from '../contexts/ConfigContext';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Loading...',
  size = 'md'
}) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const sizeStyles = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3'
  };

  const textStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`
        animate-spin rounded-full
        ${sizeStyles[size]}
        border-current opacity-25
        border-t-current opacity-75
        ${isDark ? 'text-blue-400' : 'text-blue-500'}
      `} />
      {text && (
        <span className={`
          ml-3 font-medium
          ${textStyles[size]}
          ${isDark ? 'text-gray-200' : 'text-gray-700'}
        `}>
          {text}
        </span>
      )}
    </div>
  );
}; 