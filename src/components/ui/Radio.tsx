import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const RadioButton = React.forwardRef<HTMLInputElement, RadioProps>(({
  label,
  description,
  error,
  className = '',
  size = 'md',
  disabled = false,
  ...props
}, ref) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const sizeClasses = {
    sm: {
      radio: 'w-4 h-4',
      label: 'text-sm',
      description: 'text-xs'
    },
    md: {
      radio: 'w-5 h-5',
      label: 'text-base',
      description: 'text-sm'
    },
    lg: {
      radio: 'w-6 h-6',
      label: 'text-lg',
      description: 'text-base'
    }
  };

  return (
    <label className={`relative flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="radio"
          ref={ref}
          disabled={disabled}
          className={`
            ${sizeClasses[size].radio}
            rounded-full
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
  );
});

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  error,
  size = 'md',
  className = '',
  orientation = 'vertical'
}) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={className}>
      <div className={`
        ${orientation === 'horizontal' ? 'flex flex-wrap gap-6' : 'space-y-4'}
      `}>
        {options.map((option) => (
          <RadioButton
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            size={size}
          />
        ))}
      </div>

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