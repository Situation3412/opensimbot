import { useEffect, useState } from 'react';
import { SimcVersion } from '../electron/types';

interface SimcStatus {
  isInstalled: boolean;
  needsUpdate: boolean;
  isLoading: boolean;
  version: SimcVersion | null;
}

export function useSimc() {
  const [status, setStatus] = useState<SimcStatus>({
    isInstalled: false,
    needsUpdate: false,
    isLoading: true,
    version: null
  });

  const downloadLatest = async () => {
    try {
      await window.electron.simcManager.downloadLatest();
      await checkStatus();
    } catch (error) {
      console.error('Failed to download SimC:', error);
      throw error;
    }
  };

  const checkStatus = async () => {
    try {
      const { needsInstall, needsUpdate, currentVersion } = await window.electron.simcManager.checkInstallation();
      setStatus({
        isInstalled: !needsInstall,
        needsUpdate,
        isLoading: false,
        version: currentVersion
      });
    } catch (error) {
      console.error('Failed to check SimC status:', error);
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return {
    ...status,
    downloadLatest,
    checkStatus
  };
} 