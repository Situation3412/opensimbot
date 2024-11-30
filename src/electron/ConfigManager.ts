import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { SimcConfig } from './types';

const DEFAULT_CONFIG: SimcConfig = {
  simcPath: null,
  iterations: 10000,
  threads: Math.max(1, Math.floor(require('os').cpus().length / 2)),
  theme: 'system'
};

export class ConfigManager {
  private configPath: string;

  constructor() {
    this.configPath = path.join(app.getPath('userData'), 'config.json');
  }

  async load(): Promise<SimcConfig> {
    try {
      if (!fs.existsSync(this.configPath)) {
        await this.save(DEFAULT_CONFIG);
        return DEFAULT_CONFIG;
      }

      const configData = await fs.promises.readFile(this.configPath, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(configData) };
    } catch (error) {
      console.error('Error loading config:', error);
      return DEFAULT_CONFIG;
    }
  }

  async save(config: SimcConfig): Promise<void> {
    try {
      await fs.promises.writeFile(
        this.configPath,
        JSON.stringify(config, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  }
} 