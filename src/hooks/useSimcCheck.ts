import { useState, useEffect } from 'react';
import { SimcVersion, SimcConfig } from '../electron/types';

interface SimcStatus {
  isChecking: boolean;
  needsInstall: boolean;
  needsUpdate: boolean;
  currentVersion: SimcVersion | null;
  error: string | null;
}

declare global {
  interface Window {
    electron: {
      simcManager: {
        checkInstallation: () => Promise<{
          needsInstall: boolean;
          needsUpdate: boolean;
          currentVersion: SimcVersion | null;
        }>;
        getVersion: () => Promise<string>;
        downloadLatest: () => Promise<void>;
      };
      config: {
        load: () => Promise<SimcConfig>;
        save: (config: SimcConfig) => Promise<void>;
      };
    };
  }
}

export const useSimcCheck = () => {
  const [status, setStatus] = useState<SimcStatus>({
    isChecking: true,
    needsInstall: false,
    needsUpdate: false,
    currentVersion: null,
    error: null
  });

  useEffect(() => {
    const checkSimc = async () => {
      try {
        setStatus(prev => ({ ...prev, isChecking: true }));
        const result = await window.electron.simcManager.checkInstallation();
        setStatus({
          isChecking: false,
          needsInstall: result.needsInstall,
          needsUpdate: result.needsUpdate,
          currentVersion: result.currentVersion,
          error: null
        });
      } catch (error) {
        setStatus({
          isChecking: false,
          needsInstall: false,
          needsUpdate: false,
          currentVersion: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    checkSimc();
    const interval = setInterval(checkSimc, 12 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return status;
}; 