import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: React.ReactNode;
  error?: string;
  helpText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Select: React.FC<SelectProps> = ({
  options,
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
        <select
          className={`
            w-full rounded-lg border appearance-none
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${isDark 
              ? 'bg-gray-800/50 border-gray-700/50 text-white ' +
                'focus:bg-gray-800 focus:border-blue-500/50 focus:ring-blue-500/20' 
              : 'bg-white border-gray-200 text-gray-900 ' +
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
        >
          {options.map(option => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
              className={`
                ${isDark ? 'bg-gray-800' : 'bg-white'}
                ${option.disabled 
                  ? isDark 
                    ? 'text-gray-500' 
                    : 'text-gray-400'
                  : ''
                }
              `}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg 
            className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
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