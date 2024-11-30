import React from 'react';
import { useConfig } from '../contexts/ConfigContext';

interface ThemedCardProps {
  children: React.ReactNode;
  className?: string;
}

const ThemedHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useConfig();
  return (
    <div className={`px-4 py-3 border-b ${
      config.theme === 'dark' 
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      {children}
    </div>
  );
};

const ThemedBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useConfig();
  
  return (
    <div className={`p-4 ${
      config.theme === 'dark' 
        ? 'bg-gray-800 text-gray-100' 
        : 'bg-white text-gray-900'
    }`}>
      {children}
    </div>
  );
};

const ThemedCardComponent: React.FC<ThemedCardProps> & {
  Header: typeof ThemedHeader;
  Body: typeof ThemedBody;
} = ({ children, className = '' }) => {
  const { config } = useConfig();
  
  return (
    <div className={`rounded-lg border ${
      config.theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } ${className}`}>
      {children}
    </div>
  );
};

ThemedCardComponent.Header = ThemedHeader;
ThemedCardComponent.Body = ThemedBody;

export const ThemedCard = ThemedCardComponent; 