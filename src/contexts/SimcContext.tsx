import React, { createContext, useContext, useState, useEffect } from 'react';
import { SimcVersion } from '../electron/types';

export interface SimcContextType {
  needsInstall: boolean;
  needsUpdate: boolean;
  version: string | null;
  currentVersion: SimcVersion | null;
  error: string | null;
  isChecking: boolean;
  checkInstallation: () => Promise<void>;
  downloadLatest: () => Promise<void>;
}

const SimcContext = createContext<SimcContextType | null>(null);

export const SimcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [needsInstall, setNeedsInstall] = useState(false);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [version, setVersion] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<SimcVersion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkInstallation = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const result = await window.electron.simcManager.checkInstallation();
      setNeedsInstall(result.needsInstall);
      setNeedsUpdate(result.needsUpdate);
      setCurrentVersion(result.currentVersion);
      const versionStr = await window.electron.simcManager.getVersion();
      setVersion(versionStr);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      console.error('Error checking installation:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const downloadLatest = async () => {
    try {
      await window.electron.simcManager.downloadLatest();
      await checkInstallation();
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      console.error('Error downloading latest:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkInstallation();
  }, []);

  return (
    <SimcContext.Provider value={{
      needsInstall,
      needsUpdate,
      version,
      currentVersion,
      error,
      isChecking,
      checkInstallation,
      downloadLatest
    }}>
      {children}
    </SimcContext.Provider>
  );
};

export const useSimc = () => {
  const context = useContext(SimcContext);
  if (!context) {
    throw new Error('useSimc must be used within a SimcProvider');
  }
  return context;
}; 