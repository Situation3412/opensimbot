import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  error?: string;
  helpText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  size = 'md',
  className = '',
  ...props
}) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const labelSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="w-full">
      {label && (
        <label className={`
          block mb-1.5 font-medium tracking-tight
          ${labelSizeStyles[size]}
          ${isDark ? 'text-gray-200' : 'text-gray-700'}
        `}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full rounded-lg border
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${isDark 
              ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 ' +
                'focus:bg-gray-800 focus:border-blue-500/50 focus:ring-blue-500/20' 
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 ' +
                'focus:border-blue-500/50 focus:ring-blue-500/20'
            }
            ${error 
              ? isDark 
                ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' 
                : 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : ''
            }
            ${sizeStyles[size]}
            ${className}
          `}
          {...props}
        />
      </div>
      {helpText && !error && (
        <p className={`
          mt-1.5 text-sm
          ${isDark ? 'text-gray-400' : 'text-gray-600'}
        `}>
          {helpText}
        </p>
      )}
      {error && (
        <p className={`
          mt-1.5 text-sm font-medium
          ${isDark ? 'text-red-400' : 'text-red-500'}
        `}>
          {error}
        </p>
      )}
    </div>
  );
}; 