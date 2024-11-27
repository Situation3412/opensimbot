import React from 'react';
import { Form, FormControlProps, FormSelectProps } from 'react-bootstrap';
import { useConfig } from '../contexts/ConfigContext';

interface ThemedFormControlProps extends FormControlProps {
  plaintext?: boolean;
}

export const ThemedFormControl: React.FC<ThemedFormControlProps> = ({ className = '', ...props }) => {
  const { config } = useConfig();
  
  const darkModeClass = config.theme === 'dark' ? 'bg-dark text-light' : '';
  
  const darkModeStyle = config.theme === 'dark' ? {
    backgroundColor: props.plaintext ? 'transparent' : '#2b3035',
    borderColor: '#495057',
    color: '#fff',
    '&:focus': {
      backgroundColor: '#2b3035',
      borderColor: '#86b7fe',
      color: '#fff'
    }
  } : undefined;

  // Additional styles for textarea
  const textareaStyle = props.as === 'textarea' && config.theme === 'dark' ? {
    ...darkModeStyle,
    '&:focus': {
      ...darkModeStyle?.['&:focus'],
      backgroundColor: '#2b3035',
      borderColor: '#86b7fe',
      boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
    }
  } : undefined;
  
  return (
    <Form.Control
      className={`${className} ${darkModeClass}`}
      style={{ ...darkModeStyle, ...textareaStyle } as React.CSSProperties}
      {...props}
    />
  );
};

export const ThemedSelect: React.FC<Omit<FormSelectProps, 'ref'>> = ({ className = '', ...props }) => {
  const { config } = useConfig();
  
  const darkModeClass = config.theme === 'dark' ? 'bg-dark text-light' : '';
  
  return (
    <Form.Select
      className={`${className} ${darkModeClass}`}
      style={config.theme === 'dark' ? {
        backgroundColor: '#2b3035',
        borderColor: '#495057',
        color: '#fff'
      } : undefined}
      {...props}
    />
  );
}; 