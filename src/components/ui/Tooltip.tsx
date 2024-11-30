import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { getComponentStyles, getThemeStyle } from '../../utils/theme';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const tooltipBg = getThemeStyle('tooltip.bg', isDark).split(' ')[0].replace('bg-', 'border-');

  const positionStyles = {
    top: {
      tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      arrow: `top-full left-1/2 -translate-x-1/2 -mt-px ${tooltipBg} border-x-transparent border-b-transparent`,
      enter: 'animate-tooltip-enter-top'
    },
    right: {
      tooltip: 'left-full top-1/2 -translate-y-1/2 ml-2',
      arrow: `right-full top-1/2 -translate-y-1/2 -mr-px ${tooltipBg} border-y-transparent border-l-transparent`,
      enter: 'animate-tooltip-enter-right'
    },
    bottom: {
      tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2',
      arrow: `bottom-full left-1/2 -translate-x-1/2 -mb-px ${tooltipBg} border-x-transparent border-t-transparent`,
      enter: 'animate-tooltip-enter-bottom'
    },
    left: {
      tooltip: 'right-full top-1/2 -translate-y-1/2 mr-2',
      arrow: `left-full top-1/2 -translate-y-1/2 -ml-px ${tooltipBg} border-y-transparent border-r-transparent`,
      enter: 'animate-tooltip-enter-left'
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <>
          <div className={`
            ${getComponentStyles('tooltip', undefined, isDark)}
            ${positionStyles[position].tooltip}
            ${positionStyles[position].enter}
            ${className}
          `}>
            {content}
            <div className={`
              absolute w-2 h-2 border-4
              ${positionStyles[position].arrow}
            `} />
          </div>
        </>
      )}
    </div>
  );
}; 