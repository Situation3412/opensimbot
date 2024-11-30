import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { TextArea } from './ui/TextArea';

interface Props {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export const CharacterImport: React.FC<Props> = ({ value, onChange, rows = 10 }) => {
  const { config } = useConfig();

  return (
    <div className="mb-4">
      <label className={`block mb-2 ${
        config.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
      }`}>
        Character Import String
      </label>
      <TextArea
        rows={rows}
        placeholder="Paste your SimC addon export here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border ${
          config.theme === 'dark'
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <p className={`mt-2 text-sm ${
        config.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      }`}>
        You can get this from the in-game SimC addon using /simc
      </p>
    </div>
  );
}; 