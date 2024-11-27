import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { SimcConfig } from '../types';
import { ConfigError } from '../utils/errors';

export class ConfigManager {
  private static readonly CONFIG_FILE = 'config.json';
  private config: SimcConfig;

  constructor() {
    this.config = this.getDefaultConfig();
  }

  private getDefaultConfig(): SimcConfig {
    return {
      simcPath: null,
      iterations: 10000,
      threads: Math.max(1, require('os').cpus().length - 1),
      theme: 'system'
    };
  }

  async load(): Promise<SimcConfig> {
    try {
      const configPath = path.join(app.getPath('userData'), ConfigManager.CONFIG_FILE);
      const exists = await fs.access(configPath).then(() => true).catch(() => false);
      
      if (!exists) {
        await this.save(this.config);
        return this.config;
      }

      const data = await fs.readFile(configPath, 'utf8');
      this.config = { ...this.getDefaultConfig(), ...JSON.parse(data) };
      return this.config;
    } catch (error) {
      throw new ConfigError(`Failed to load config: ${error}`);
    }
  }

  async save(config: Partial<SimcConfig>): Promise<void> {
    try {
      this.config = { ...this.config, ...config };
      const configPath = path.join(app.getPath('userData'), ConfigManager.CONFIG_FILE);
      await fs.writeFile(configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      throw new ConfigError(`Failed to save config: ${error}`);
    }
  }
} 