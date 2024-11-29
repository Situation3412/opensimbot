export interface SimcVersion {
  major: number;
  minor: number;
  patch: number;
  gitVersion?: string;
  commitsBehind?: number;
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
  theme: 'light' | 'dark' | 'system';
}

export interface SimcAPI {
  simcManager: {
    checkInstallation: () => Promise<{
      needsInstall: boolean;
      needsUpdate: boolean;
      currentVersion: SimcVersion | null;
      latestVersion: SimcVersion | null;
    }>;
    getVersion: () => Promise<string>;
    downloadLatest: () => Promise<void>;
    executeLinuxBuildStep: (params: { 
      step: number; 
      isUpdate: boolean;
      sudoPassword?: string;
    }) => Promise<string>;
    getPlatform: () => Promise<'linux' | 'win32' | 'darwin'>;
    checkMissingDependencies: () => Promise<string[]>;
    installDependencies: (params: { 
      packages: string[]; 
      sudoPassword: string;
    }) => Promise<string>;
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

export interface SimulationResult {
  dps: number;
  error: string | null;
  metadata?: {
    iterations: number;
    targetError: number;
    convergence?: number;
    simcVersion: string;
    timestamp: number;
  };
  rawOutput?: string;
}

export interface SimulationProgress {
  status: string;
  progress: number;
  currentIteration?: number;
  totalIterations?: number;
  estimatedTimeRemaining?: number;
}

// Add any other shared types here 