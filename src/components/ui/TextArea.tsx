import React, { useEffect, useRef } from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: React.ReactNode;
  error?: string;
  helpText?: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  maxCount?: number;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  hideScrollbar?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  helpText,
  className = '',
  size = 'md',
  showCount = false,
  maxCount,
  autoResize = true,
  minRows = 3,
  maxRows = 8,
  hideScrollbar = false,
  value,
  onChange,
  disabled = false,
  ...props
}, ref) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const mergedRef = (node: HTMLTextAreaElement) => {
    textAreaRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const sizeClasses = {
    sm: 'text-sm px-2.5 py-1.5',
    md: 'px-3 py-2',
    lg: 'text-lg px-4 py-2.5'
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }
    if (autoResize) {
      adjustHeight();
    }
  };

  const adjustHeight = () => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate line height from computed styles
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
    const paddingTop = parseInt(window.getComputedStyle(textarea).paddingTop);
    const paddingBottom = parseInt(window.getComputedStyle(textarea).paddingBottom);
    
    // Calculate min and max heights based on rows
    const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
    
    // Set new height
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    if (autoResize) {
      adjustHeight();
    }
  }, [value, autoResize]);

  const characterCount = typeof value === 'string' ? value.length : 0;
  const isOverLimit = maxCount !== undefined && characterCount > maxCount;

  return (
    <div className={className}>
      {label && (
        <label className={`
          block mb-1.5 font-medium
          ${isDark ? 'text-gray-200' : 'text-gray-700'}
          ${disabled ? 'opacity-50' : ''}
        `}>
          {label}
        </label>
      )}

      <div className="relative">
        <textarea
          ref={mergedRef}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`
            block w-full rounded-lg
            transition-colors duration-200
            resize-none
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${hideScrollbar ? 'scrollbar-hide' : 'scrollbar-thin scrollbar-thumb-rounded'}
            ${isDark && !hideScrollbar ? 'scrollbar-track-gray-800 scrollbar-thumb-gray-700' : 'scrollbar-track-gray-100 scrollbar-thumb-gray-300'}
            ${sizeClasses[size]}
            ${isDark
              ? disabled
                ? 'bg-gray-700 border-gray-600 text-gray-400'
                : 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
              : disabled
                ? 'bg-gray-100 border-gray-200 text-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
            }
            ${error
              ? isDark
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border'
            }
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          {...props}
        />

        {showCount && (
          <div className={`
            absolute right-2 bottom-2 text-xs
            ${isDark ? 'text-gray-400' : 'text-gray-500'}
            ${isOverLimit ? 'text-red-500' : ''}
            ${disabled ? 'opacity-50' : ''}
          `}>
            {maxCount
              ? `${characterCount}/${maxCount}`
              : characterCount
            }
          </div>
        )}
      </div>

      {helpText && !error && (
        <p className={`
          mt-1.5 text-sm
          ${isDark ? 'text-gray-400' : 'text-gray-600'}
          ${disabled ? 'opacity-50' : ''}
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
});

TextArea.displayName = 'TextArea';

export { TextArea }; 