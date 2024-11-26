import React, { createContext, useContext, useState, useEffect } from 'react';
import { SimcVersion } from '../electron/types';

interface SimcContextType {
  isChecking: boolean;
  needsInstall: boolean;
  needsUpdate: boolean;
  currentVersion: SimcVersion | null;
  error: string | null;
  checkInstallation: () => Promise<void>;
  downloadLatest: () => Promise<void>;
}

interface SimcState {
  isChecking: boolean;
  needsInstall: boolean;
  needsUpdate: boolean;
  currentVersion: SimcVersion | null;
  error: string | null;
}

const SimcContext = createContext<SimcContextType | null>(null);

export const SimcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SimcState>({
    isChecking: true,
    needsInstall: false,
    needsUpdate: false,
    currentVersion: null,
    error: null
  });

  const checkInstallation = async () => {
    try {
      setState(prev => ({ ...prev, isChecking: true, error: null }));
      const result = await window.electron.simcManager.checkInstallation();
      setState({
        isChecking: false,
        needsInstall: result.needsInstall,
        needsUpdate: result.needsUpdate,
        currentVersion: result.currentVersion,
        error: null
      });
    } catch (error) {
      setState({
        isChecking: false,
        needsInstall: false,
        needsUpdate: false,
        currentVersion: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const downloadLatest = async () => {
    try {
      setState(prev => ({ ...prev, isChecking: true, error: null }));
      await window.electron.simcManager.downloadLatest();
      await checkInstallation();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isChecking: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  useEffect(() => {
    checkInstallation();
    const interval = setInterval(checkInstallation, 12 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SimcContext.Provider 
      value={{ ...state, checkInstallation, downloadLatest }}
    >
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