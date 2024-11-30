import React from 'react';
import { Button } from './ui/Button';
import { LoadingSpinner } from './LoadingSpinner';
import { useSimc } from '../contexts/SimcContext';
import { useToast } from '../contexts/ToastContext';
import { useConfig } from '../contexts/ConfigContext';

export const SimcStatus: React.FC = () => {
  const { showToast } = useToast();
  const { config } = useConfig();
  const isDark = config.theme === 'dark';
  const {
    isInstalled,
    needsUpdate,
    isLoading,
    version,
    downloadLatest
  } = useSimc();

  const handleDownload = async () => {
    try {
      await downloadLatest();
      showToast('success', 'SimulationCraft downloaded successfully');
    } catch (error) {
      showToast('error', 'Failed to download SimulationCraft');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`
      p-4 border-b transition-colors duration-200
      ${isDark 
        ? 'bg-bnet-gray-700/50 border-bnet-gray-600' 
        : 'bg-white border-bnet-gray-200'
      }
    `}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div>
          <h2 className={`
            text-lg font-semibold
            ${isDark ? 'text-bnet-gray-100' : 'text-bnet-gray-900'}
          `}>
            SimulationCraft Status
          </h2>
          <p className={`
            text-sm mt-0.5
            ${isDark ? 'text-bnet-gray-400' : 'text-bnet-gray-500'}
          `}>
            {isInstalled ? 'Installed' : 'Not installed'}
            {version && ` (v${version.major}.${version.minor}.${version.patch})`}
          </p>
        </div>
        <Button
          onClick={handleDownload}
          disabled={isLoading}
          variant={needsUpdate ? 'primary' : 'secondary'}
        >
          {needsUpdate ? 'Update' : 'Download'}
        </Button>
      </div>
    </div>
  );
}; 