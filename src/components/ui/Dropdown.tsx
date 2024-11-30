import React, { useState, useRef, useEffect } from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  helpText?: string;
  placeholder?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  helpText,
  placeholder = 'Select an option',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className={`block mb-2 font-medium ${
          isDark ? 'text-gray-200' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-3 py-2 rounded-lg border text-left
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isDark 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
            }
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </button>
        
        {isOpen && (
          <div className={`
            absolute z-10 w-full mt-1 rounded-lg border shadow-lg
            ${isDark 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-white border-gray-200'
            }
          `}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-3 py-2 text-left
                  ${isDark 
                    ? 'hover:bg-gray-600 text-white' 
                    : 'hover:bg-gray-50 text-gray-900'
                  }
                  ${option.value === value 
                    ? isDark 
                      ? 'bg-gray-600' 
                      : 'bg-gray-100'
                    : ''
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
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