import React, { useEffect } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

interface HeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

interface BodyProps {
  children: React.ReactNode;
  className?: string;
}

interface FooterProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, onClose, className = '' }) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  return (
    <div className={`
      flex items-center justify-between px-6 py-4 border-b
      ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
      ${className}
    `}>
      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {children}
      </h3>
      {onClose && (
        <button
          onClick={onClose}
          className={`
            rounded-lg p-2 hover:bg-opacity-10
            transition-colors duration-200
            ${isDark ? 'hover:bg-gray-300' : 'hover:bg-gray-600'}
          `}
        >
          <svg 
            className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    </div>
  );
};

const Body: React.FC<BodyProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const Footer: React.FC<FooterProps> = ({ children, className = '' }) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  return (
    <div className={`
      flex justify-end gap-3 px-6 py-4 border-t
      ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
      ${className}
    `}>
      {children}
    </div>
  );
};

export const Modal: React.FC<ModalProps> & {
  Header: typeof Header;
  Body: typeof Body;
  Footer: typeof Footer;
} = ({
  isOpen,
  onClose,
  children,
  className = '',
  size = 'md'
}) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className={`
            fixed inset-0 backdrop-blur-sm bg-black/50
            transition-opacity duration-300 ease-out
            ${isOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <div 
          className={`
            relative w-full transform rounded-xl shadow-2xl
            transition-all duration-300 ease-out
            ${sizeClasses[size]}
            ${isDark 
              ? 'bg-gray-800/90 border border-gray-700/50' 
              : 'bg-white/90 border border-gray-200/50'
            }
            ${isOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
            }
            ${className}
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer; 