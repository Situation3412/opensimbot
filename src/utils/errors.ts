export class SimcError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'SimcError';
  }
}

export class ConfigError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export function isSimcError(error: unknown): error is SimcError {
  return error instanceof SimcError;
}

export function isConfigError(error: unknown): error is ConfigError {
  return error instanceof ConfigError;
} 