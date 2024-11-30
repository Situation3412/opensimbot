import React, { useState, useRef, useEffect } from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface Tab {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'line' | 'pill' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  className = ''
}) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Update indicator position when active tab changes
  useEffect(() => {
    const activeTabElement = tabsRef.current.find(
      (ref) => ref?.getAttribute('data-tab-id') === activeTab
    );

    if (activeTabElement && variant === 'line') {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({
        left: offsetLeft,
        width: offsetWidth
      });
    }
  }, [activeTab, variant]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const tabCount = tabs.length;
    let nextIndex = index;

    switch (e.key) {
      case 'ArrowLeft':
        nextIndex = (index - 1 + tabCount) % tabCount;
        break;
      case 'ArrowRight':
        nextIndex = (index + 1) % tabCount;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabCount - 1;
        break;
      default:
        return;
    }

    const nextTab = tabs[nextIndex];
    if (nextTab && !nextTab.disabled) {
      setActiveTab(nextTab.id);
      onChange?.(nextTab.id);
      tabsRef.current[nextIndex]?.focus();
    }
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'text-lg px-6 py-3'
  };

  const getVariantClasses = (isActive: boolean, isDisabled: boolean = false) => {
    const baseClasses = 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    if (isDisabled) {
      return `${baseClasses} cursor-not-allowed opacity-50`;
    }

    switch (variant) {
      case 'pill':
        return `
          ${baseClasses}
          ${isDark
            ? isActive
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            : isActive
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
          }
          rounded-full
        `;
      case 'enclosed':
        return `
          ${baseClasses}
          ${isDark
            ? isActive
              ? 'bg-gray-800 text-white border-t border-x border-gray-700'
              : 'text-gray-400 hover:text-gray-300'
            : isActive
              ? 'bg-white text-gray-900 border-t border-x border-gray-200'
              : 'text-gray-600 hover:text-gray-900'
          }
          ${isActive ? 'border-b-0' : ''}
          rounded-t-lg
        `;
      default: // line
        return `
          ${baseClasses}
          ${isDark
            ? isActive
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-300'
            : isActive
              ? 'text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
          }
          border-b-2 border-transparent
        `;
    }
  };

  return (
    <div className={className}>
      {/* Tab List */}
      <div
        className={`
          relative flex ${fullWidth ? 'w-full' : ''}
          ${variant === 'enclosed' 
            ? isDark 
              ? 'border-b border-gray-700' 
              : 'border-b border-gray-200'
            : ''
          }
        `}
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => (tabsRef.current[index] = el)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            data-tab-id={tab.id}
            disabled={tab.disabled}
            className={`
              ${sizeClasses[size]}
              ${getVariantClasses(activeTab === tab.id, tab.disabled)}
              ${fullWidth ? 'flex-1' : ''}
            `}
            onClick={() => {
              if (!tab.disabled) {
                setActiveTab(tab.id);
                onChange?.(tab.id);
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}

        {/* Active Tab Indicator */}
        {variant === 'line' && (
          <div
            className={`
              absolute bottom-0 h-0.5 transition-all duration-200
              ${isDark ? 'bg-white' : 'bg-gray-900'}
            `}
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width
            }}
          />
        )}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={tab.id}
            hidden={activeTab !== tab.id}
            className={`
              transition-opacity duration-200
              ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}; 