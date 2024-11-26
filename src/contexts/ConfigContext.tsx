import React, { createContext, useContext, useState, useEffect } from 'react';

interface SimcConfig {
  simcPath: string | null;
  iterations: number;
  threads: number;
}

interface ConfigContextType {
  config: SimcConfig;
  updateConfig: (newConfig: Partial<SimcConfig>) => Promise<void>;
}

const DEFAULT_CONFIG: SimcConfig = {
  simcPath: null,
  iterations: 10000,
  threads: Math.max(1, navigator.hardwareConcurrency - 1)
};

const ConfigContext = createContext<ConfigContextType | null>(null);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SimcConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    // Load config from electron-store on mount
    const loadConfig = async () => {
      try {
        const savedConfig = await window.electron.config.load();
        setConfig(prev => ({ ...prev, ...savedConfig }));
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    };
    loadConfig();
  }, []);

  const updateConfig = async (newConfig: Partial<SimcConfig>) => {
    try {
      const updatedConfig = { ...config, ...newConfig };
      await window.electron.config.save(updatedConfig);
      setConfig(updatedConfig);
    } catch (error) {
      console.error('Failed to save config:', error);
      throw error;
    }
  };

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