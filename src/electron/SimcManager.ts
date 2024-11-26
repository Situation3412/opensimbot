import { app } from 'electron';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import { SimcVersion, SimcState } from './types';
import { SimcError } from './utils/errors';
import { logger } from './utils/logger';

const execAsync = promisify(exec);

interface SerializableError {
  name: string;
  message: string;
  code?: string;
}

export class SimcManager {
  private static readonly STATE_FILE = 'simc-state.json';
  private static readonly CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
  private simcPath: string | null = null;
  private static LATEST_VERSION: SimcVersion = { major: 1, minor: 0, patch: 0 };

  constructor() {
    this.initialize();
  }

  private async initialize() {
    const state = await this.loadState();
    this.simcPath = state.simcPath;
  }

  async findSimcInstallation(): Promise<string | null> {
    try {
      logger.debug('Checking common installation paths...');
      const commonPaths = [
        process.env.SIMC_PATH,
        '/usr/local/bin/simc',
        '/usr/bin/simc',
        'C:\\Program Files\\SimulationCraft\\simc.exe',
        path.join(process.env.HOME || '', '.local/bin/simc')
      ];

      for (const path of commonPaths) {
        if (path) {
          logger.debug(`Checking path: ${path}`);
          if (fs.existsSync(path)) {
            logger.info(`Found SimC at: ${path}`);
            return path;
          }
        }
      }

      logger.debug('Checking PATH environment...');
      try {
        const { stdout } = await execAsync('which simc');
        if (stdout.trim()) {
          logger.info(`Found SimC in PATH: ${stdout.trim()}`);
          return stdout.trim();
        }
      } catch (error) {
        // Silently handle 'which' command failure
        logger.debug('SimC not found in PATH');
      }

      logger.info('SimC not found in any location');
      return null;
    } catch (error) {
      // Ensure we only return serializable data
      logger.error('Error finding SimC:', error);
      if (error instanceof Error) {
        throw new SimcError(error.message);
      }
      throw new SimcError('Unknown error occurred while finding SimC');
    }
  }

  async getInstalledVersion(): Promise<SimcVersion | null> {
    if (!this.simcPath) return null;

    try {
      const { stdout } = await execAsync(`"${this.simcPath}" --version`);
      const versionMatch = stdout.match(/SimulationCraft (\d+)\.(\d+)\.(\d+)/i);
      if (versionMatch) {
        return {
          major: parseInt(versionMatch[1]),
          minor: parseInt(versionMatch[2]),
          patch: parseInt(versionMatch[3])
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async checkForUpdates(): Promise<boolean> {
    const currentVersion = await this.getInstalledVersion();
    if (!currentVersion) return true;

    return false; // TODO: Implement actual version checking
  }

  async downloadLatestVersion(): Promise<void> {
    // TODO: Implement download logic
    throw new Error('Not implemented');
  }

  async performCheck(): Promise<{
    needsInstall: boolean;
    needsUpdate: boolean;
    currentVersion: SimcVersion | null;
  }> {
    try {
      this.simcPath = await this.findSimcInstallation();
      const currentVersion = await this.getInstalledVersion();
      const needsUpdate = await this.checkForUpdates();

      return {
        needsInstall: !this.simcPath,
        needsUpdate,
        currentVersion: currentVersion ? {
          major: currentVersion.major,
          minor: currentVersion.minor,
          patch: currentVersion.patch
        } : null
      };
    } catch (error) {
      logger.error('Error in performCheck:', error);
      throw {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown Error'
      };
    }
  }

  private async loadState(): Promise<SimcState> {
    try {
      const stateFile = path.join(app.getPath('userData'), SimcManager.STATE_FILE);
      const state = await fs.promises.readFile(stateFile, 'utf-8');
      return JSON.parse(state);
    } catch (error) {
      return { lastCheckTime: 0, installedVersion: null, simcPath: null };
    }
  }

  private async saveState(state: SimcState): Promise<void> {
    try {
      const stateFile = path.join(app.getPath('userData'), SimcManager.STATE_FILE);
      await fs.promises.writeFile(stateFile, JSON.stringify(state, null, 2));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }
}