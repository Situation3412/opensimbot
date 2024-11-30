import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  error,
  className = '',
  size = 'md',
  indeterminate = false,
  disabled = false,
  ...props
}, ref) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  // Handle indeterminate state
  React.useEffect(() => {
    if (ref && typeof ref !== 'function') {
      ref.current!.indeterminate = indeterminate;
    }
  }, [ref, indeterminate]);

  const sizeClasses = {
    sm: {
      checkbox: 'w-4 h-4',
      label: 'text-sm',
      description: 'text-xs'
    },
    md: {
      checkbox: 'w-5 h-5',
      label: 'text-base',
      description: 'text-sm'
    },
    lg: {
      checkbox: 'w-6 h-6',
      label: 'text-lg',
      description: 'text-base'
    }
  };

  return (
    <div className={className}>
      <label className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            ref={ref}
            disabled={disabled}
            className={`
              ${sizeClasses[size].checkbox}
              rounded
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isDark
                ? disabled
                  ? 'bg-gray-700 border-gray-600 text-gray-500'
                  : 'bg-gray-800 border-gray-600 text-blue-500 focus:border-blue-500 focus:ring-blue-500'
                : disabled
                  ? 'bg-gray-100 border-gray-300 text-gray-400'
                  : 'bg-white border-gray-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500'
              }
              ${error
                ? isDark
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : ''
              }
              cursor-pointer
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
            {...props}
          />
        </div>

        {(label || description) && (
          <div className="ml-3">
            {label && (
              <span className={`
                font-medium
                ${sizeClasses[size].label}
                ${isDark ? 'text-gray-200' : 'text-gray-900'}
                ${disabled ? 'opacity-50' : ''}
              `}>
                {label}
              </span>
            )}
            {description && (
              <p className={`
                mt-1
                ${sizeClasses[size].description}
                ${isDark ? 'text-gray-400' : 'text-gray-500'}
                ${disabled ? 'opacity-50' : ''}
              `}>
                {description}
              </p>
            )}
          </div>
        )}
      </label>

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
}); 