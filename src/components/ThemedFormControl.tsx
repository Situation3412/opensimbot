import React, { forwardRef } from 'react';
import { useConfig } from '../contexts/ConfigContext';

type FormControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface ThemedFormControlProps {
  plaintext?: boolean;
  rows?: number;
  as?: 'input' | 'textarea' | 'select';
  children?: React.ReactNode;
  onChange?: React.ChangeEventHandler<FormControlElement>;
  className?: string;
  style?: React.CSSProperties;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}

export const ThemedFormControl = forwardRef<any, ThemedFormControlProps>((props, ref) => {
  const { config } = useConfig();
  const { className, style, as = 'input', ...restProps } = props;
  const isDark = config.theme === 'dark';
  
  const baseClasses = `
    w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 transition-colors duration-200
    ${isDark 
      ? 'bg-bnet-gray-700 border-bnet-gray-600 text-white placeholder-bnet-gray-400 focus:ring-bnet-blue-500/50' 
      : 'bg-white border-bnet-gray-300 text-bnet-gray-900 placeholder-bnet-gray-500 focus:ring-bnet-blue-500/30'}
    ${className || ''}
  `;

  const Component = as;
  
  return (
    <Component
      {...restProps}
      ref={ref}
      className={baseClasses}
      style={style}
    />
  );
});

ThemedFormControl.displayName = 'ThemedFormControl';

export interface ThemedSelectProps extends Omit<ThemedFormControlProps, 'as'> {
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export const ThemedSelect = forwardRef<HTMLSelectElement, ThemedSelectProps>((props, ref) => {
  const { onChange, ...rest } = props;
  
  return (
    <ThemedFormControl
      ref={ref}
      as="select"
      {...rest}
      onChange={onChange as React.ChangeEventHandler<FormControlElement>}
    />
  );
});

ThemedSelect.displayName = 'ThemedSelect'; 