import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const DefaultSeparator = () => (
  <svg 
    className="w-4 h-4" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M9 5l7 7-7 7" 
    />
  </svg>
);

const HomeIcon = () => (
  <svg 
    className="w-4 h-4" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
    />
  </svg>
);

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = <DefaultSeparator />,
  maxItems = 0,
  className = '',
  size = 'md'
}) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Handle truncation if maxItems is specified
  const visibleItems = maxItems > 0 && items.length > maxItems
    ? [
        ...items.slice(0, 1),
        { label: '...', href: undefined },
        ...items.slice(-2)
      ]
    : items;

  return (
    <nav 
      aria-label="Breadcrumbs"
      className={`${className} ${sizeClasses[size]}`}
    >
      <ol className="flex items-center space-x-2">
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li 
              key={index} 
              className="flex items-center"
            >
              {index === 0 && !item.icon && (
                <span className={`
                  mr-1
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <HomeIcon />
                </span>
              )}
              
              {item.icon && (
                <span className={`
                  mr-1
                  ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  {item.icon}
                </span>
              )}

              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className={`
                    hover:underline transition-colors duration-200
                    ${isDark 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                    }
                    ${isEllipsis ? 'cursor-default hover:no-underline' : ''}
                  `}
                >
                  {item.label}
                </a>
              ) : (
                <span className={`
                  ${isLast
                    ? isDark
                      ? 'text-white font-medium'
                      : 'text-gray-900 font-medium'
                    : isDark
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }
                `}>
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className={`
                  mx-2 flex-shrink-0
                  ${isDark ? 'text-gray-600' : 'text-gray-400'}
                `}>
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}; 