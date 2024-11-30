import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  helpText,
  className = '',
  ...props
}) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  return (
    <div className="w-full">
      {label && (
        <label className={`block mb-2 font-medium ${
          isDark ? 'text-gray-200' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      <input
        type="password"
        className={`
          w-full px-3 py-2 rounded-lg border transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${isDark 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {helpText && (
        <p className={`mt-2 text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {helpText}
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}; 