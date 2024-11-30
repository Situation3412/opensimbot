import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  className = ''
}) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';
  
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4'
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && (
            <span className={`text-sm font-medium ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {label}
            </span>
          )}
          {showValue && (
            <span className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className={`
        w-full rounded-full
        ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
        ${sizeStyles[size]}
      `}>
        <div
          className={`
            rounded-full transition-all duration-300
            ${isDark ? 'bg-blue-500' : 'bg-blue-600'}
            ${sizeStyles[size]}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}; 