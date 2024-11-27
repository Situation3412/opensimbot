export interface SimcVersion {
  major: number;
  minor: number;
  patch: number;
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
}

// Add any other shared types here 