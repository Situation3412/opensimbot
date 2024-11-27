export class SimcError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'SimcError';
  }
}

export class DownloadError extends SimcError {
  constructor(message: string) {
    super(message, 'DOWNLOAD_ERROR');
  }
}

export class BuildError extends SimcError {
  constructor(message: string) {
    super(message, 'BUILD_ERROR');
  }
}

export class InstallationError extends SimcError {
  constructor(message: string) {
    super(message, 'INSTALLATION_ERROR');
  }
}

export class SimulationError extends SimcError {
  constructor(message: string) {
    super(message, 'SIMULATION_ERROR');
  }
}

export class ConfigError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'ConfigError';
  }
} 