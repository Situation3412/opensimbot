import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { getComponentStyles, getThemeStyles } from '../../utils/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<CardProps> = ({ children, className = '' }) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';
  
  return (
    <div className={`
      px-6 py-4 border-b transition-colors duration-200
      ${getThemeStyles([
        'card.header.bg',
        'card.header.border',
        'text.default'
      ], isDark)}
      ${className}
    `}>
      {children}
    </div>
  );
};

const Body: React.FC<CardProps> = ({ children, className = '' }) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';
  
  return (
    <div className={`
      p-6 transition-colors duration-200
      ${getThemeStyles([
        'card.body.bg',
        'text.default'
      ], isDark)}
      ${className}
    `}>
      {children}
    </div>
  );
};

const Card: React.FC<CardProps> & {
  Header: typeof Header;
  Body: typeof Body;
} = ({ children, className = '' }) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';
  
  return (
    <div className={`${getComponentStyles('card', undefined, isDark)} ${className}`}>
      {children}
    </div>
  );
};

Card.Header = Header;
Card.Body = Body;

export { Card }; 