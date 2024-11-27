import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { SimcConfig } from '../types';
import { logger } from '../utils/logger';

export class ConfigManager {
  private readonly configPath: string;
  private config: SimcConfig;

  constructor() {
    this.configPath = path.join(app.getPath('userData'), 'config.json');
    this.config = this.getDefaultConfig();
  }

  private getDefaultConfig(): SimcConfig {
    return {
      simcPath: null,
      iterations: 10000,
      threads: Math.max(1, require('os').cpus().length - 1),
      theme: 'dark'
    };
  }

  async load(): Promise<SimcConfig> {
    try {
      const data = await fs.readFile(this.configPath, 'utf8');
      this.config = { ...this.getDefaultConfig(), ...JSON.parse(data) };
      return this.config;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return this.getDefaultConfig();
      }
      throw error;
    }
  }

  async save(config: Partial<SimcConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
  }
} 