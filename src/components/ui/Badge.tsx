import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  const variantStyles = {
    default: isDark
      ? 'bg-gray-700 text-gray-200'
      : 'bg-gray-200 text-gray-800',
    success: isDark
      ? 'bg-green-900 text-green-200'
      : 'bg-green-100 text-green-800',
    warning: isDark
      ? 'bg-yellow-900 text-yellow-200'
      : 'bg-yellow-100 text-yellow-800',
    error: isDark
      ? 'bg-red-900 text-red-200'
      : 'bg-red-100 text-red-800',
    info: isDark
      ? 'bg-blue-900 text-blue-200'
      : 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`
      inline-flex items-center justify-center rounded-full font-medium
      ${sizeStyles[size]}
      ${variantStyles[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}; 