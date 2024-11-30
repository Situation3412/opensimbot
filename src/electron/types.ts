export interface SimcVersion {
  major: number;
  minor: number;
  patch: number;
}

export interface SimulationParams {
  input: string;
  iterations: number;
  threads: number;
  fightStyle: string;
  fightLength: number;
  targetError: number;
  calculateScaling: boolean;
}

export interface SimulationResult {
  dps: number;
  error: string | null;
  targetError?: number;
  rawOutput?: string;
}

export interface SimcConfig {
  simcPath: string | null;
  iterations: number;
  threads: number;
  theme: 'light' | 'dark' | 'system';
}

export interface ElectronAPI {
  simcManager: {
    checkInstallation: () => Promise<{
      needsInstall: boolean;
      needsUpdate: boolean;
      currentVersion: SimcVersion | null;
      latestVersion: SimcVersion | null;
    }>;
    getVersion: () => Promise<SimcVersion | null>;
    downloadLatest: () => Promise<void>;
    getPlatform: () => Promise<'win32' | 'darwin'>;
  };
  config: {
    load: () => Promise<SimcConfig>;
    save: (config: SimcConfig) => Promise<void>;
  };
  simc: {
    runSingleSim: (params: SimulationParams) => Promise<SimulationResult>;
    onProgress: (callback: (output: string) => void) => void;
    offProgress: () => void;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export interface SimulationProgress {
  status: string;
  progress: number;
  currentIteration?: number;
  totalIterations?: number;
  estimatedTimeRemaining?: number;
}

// Add any other shared types here 