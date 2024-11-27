export interface SimcVersion {
  major: number;
  minor: number;
  patch: number;
  gitVersion?: string;
}

export interface SimcState {
  lastCheckTime: number;
  installedVersion: SimcVersion | null;
  simcPath: string | null;
}

export interface SimcConfig {
  simcPath: string | null;
  iterations: number;
  threads: number;
  theme: 'light' | 'dark';
}

export interface SimcAPI {
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
  simc: {
    runSingleSim: (params: {
      input: string;
      iterations: number;
      threads: number;
    }) => Promise<{
      dps: number;
      error: string | null;
    }>;
    onProgress: (callback: (output: string) => void) => void;
    offProgress: () => void;
  };
}

declare global {
  interface Window {
    electron: SimcAPI;
  }
}

// Add any other shared types here 