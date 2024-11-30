import React, { createContext, useContext, useEffect, useState } from 'react';
import { SimcConfig } from '../electron/types';

interface ConfigContextType {
  config: SimcConfig;
  updateConfig: (updates: Partial<SimcConfig>) => Promise<void>;
}

const DEFAULT_CONFIG: SimcConfig = {
  simcPath: null,
  iterations: 10000,
  threads: Math.max(1, Math.floor((window.navigator.hardwareConcurrency || 4) / 2)),
  theme: 'system'
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SimcConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  const loadConfig = async () => {
    try {
      const loadedConfig = await window.electron?.config?.load();
      if (loadedConfig) {
        setConfig(loadedConfig);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<SimcConfig>) => {
    try {
      const newConfig = { ...config, ...updates };
      await window.electron?.config?.save(newConfig);
      setConfig(newConfig);
    } catch (error) {
      console.error('Failed to update config:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}; 