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