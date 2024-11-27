import React, { forwardRef } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { useConfig } from '../contexts/ConfigContext';

type FormControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface ThemedFormControlProps extends FormControlProps {
  plaintext?: boolean;
  rows?: number;
  as?: 'input' | 'textarea' | 'select';
  children?: React.ReactNode;
  onChange?: React.ChangeEventHandler<FormControlElement>;
}

export const ThemedFormControl = forwardRef<FormControlElement, ThemedFormControlProps>((props, ref) => {
  const { config } = useConfig();
  const { className, style, ...restProps } = props;
  
  return (
    <Form.Control
      {...restProps}
      ref={ref as any}
      className={`${className || ''} ${config.theme === 'dark' ? 'bg-dark text-light' : ''}`}
      style={{
        ...style,
        borderColor: config.theme === 'dark' ? '#495057' : undefined
      }}
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