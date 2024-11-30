import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { getComponentStyles } from '../../utils/theme';
import type { ComponentVariant } from '../../utils/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ComponentVariant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const baseStyles = `
    inline-flex items-center justify-center 
    rounded-lg font-medium 
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-95
  `;
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed hover:!bg-current active:!scale-100';

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${getComponentStyles('button', variant, isDark)}
        ${(disabled || isLoading) ? disabledStyles : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}; 