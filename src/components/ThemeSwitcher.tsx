import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { BsSun, BsMoon, BsDisplay } from 'react-icons/bs';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';

export const ThemeSwitcher: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const isDark = config.theme === 'dark';

  const themes = [
    { value: 'light', label: 'Light', icon: <BsSun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <BsMoon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <BsDisplay className="w-4 h-4" /> }
  ];

  return (
    <div className="flex space-x-2">
      {themes.map(({ value, label, icon }) => (
        <Tooltip key={value} content={label} position="bottom">
          <Button
            variant={config.theme === value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => updateConfig({ ...config, theme: value as 'light' | 'dark' | 'system' })}
            className={`p-2 ${
              config.theme === value
                ? isDark
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : ''
            }`}
          >
            {icon}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}; 