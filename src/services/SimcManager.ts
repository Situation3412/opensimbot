import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { app } from '../utils/electron';

const execAsync = promisify(exec);

interface SimcVersion {
  major: number;
  minor: number;
  patch: number;
}

interface SimcState {
  lastCheckTime: number;
  installedVersion: SimcVersion | null;
  simcPath: string | null;
}

export class SimcManager {
  public static readonly CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  private static readonly STATE_FILE = 'simc-state.json';
  private simcPath: string | null = null;
  private static LATEST_VERSION: SimcVersion = { major: 1, minor: 0, patch: 0 };

  private async loadState(): Promise<SimcState> {
    try {
      const stateFile = path.join(app.getPath('userData'), SimcManager.STATE_FILE);
      if (fs.existsSync(stateFile)) {
        const data = await fs.promises.readFile(stateFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
    
    return {
      lastCheckTime: 0,
      installedVersion: null,
      simcPath: null
    };
  }

  private async saveState(state: SimcState): Promise<void> {
    try {
      const stateFile = path.join(app.getPath('userData'), SimcManager.STATE_FILE);
      await fs.promises.writeFile(stateFile, JSON.stringify(state, null, 2));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  async shouldCheck(): Promise<boolean> {
    const state = await this.loadState();
    const now = Date.now();
    return now - state.lastCheckTime >= SimcManager.CHECK_INTERVAL;
  }

  async performCheck(): Promise<{
    needsInstall: boolean;
    needsUpdate: boolean;
    currentVersion: SimcVersion | null;
  }> {
    const state = await this.loadState();
    
    // Find SimC installation
    this.simcPath = await this.findSimcInstallation();
    const currentVersion = await this.getInstalledVersion();
    
    // Update state
    await this.saveState({
      lastCheckTime: Date.now(),
      installedVersion: currentVersion,
      simcPath: this.simcPath
    });

    return {
      needsInstall: !this.simcPath,
      needsUpdate: await this.checkForUpdates(),
      currentVersion
    };
  }

  async initialize(): Promise<void> {
    this.simcPath = await this.findSimcInstallation();
    if (!this.simcPath) {
      throw new Error('SimulationCraft not found');
    }
  }

  async findSimcInstallation(): Promise<string | null> {
    try {
      // Try common installation paths
      const commonPaths = [
        process.env.SIMC_PATH, // Check environment variable first
        '/usr/local/bin/simc',
        '/usr/bin/simc',
        'C:\\Program Files\\SimulationCraft\\simc.exe',
        path.join(process.env.HOME || '', '.local/bin/simc')
      ];

      for (const path of commonPaths) {
        if (path && fs.existsSync(path)) {
          return path;
        }
      }

      // Try PATH
      const { stdout } = await execAsync('which simc');
      if (stdout.trim()) {
        return stdout.trim();
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async getInstalledVersion(): Promise<SimcVersion | null> {
    if (!this.simcPath) return null;

    try {
      const { stdout } = await execAsync(`"${this.simcPath}" --version`);
      // Parse version from output (format might vary)
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

    // Compare with LATEST_VERSION
    if (currentVersion.major < SimcManager.LATEST_VERSION.major) return true;
    if (currentVersion.major === SimcManager.LATEST_VERSION.major && 
        currentVersion.minor < SimcManager.LATEST_VERSION.minor) return true;
    if (currentVersion.major === SimcManager.LATEST_VERSION.major && 
        currentVersion.minor === SimcManager.LATEST_VERSION.minor && 
        currentVersion.patch < SimcManager.LATEST_VERSION.patch) return true;

    return false;
  }

  async downloadLatestVersion(): Promise<void> {
    // Implementation will vary based on platform
    throw new Error('Not implemented');
  }

  async runSimulation(input: string): Promise<string> {
    if (!this.simcPath) throw new Error('SimulationCraft not installed');

    try {
      const { stdout } = await execAsync(`"${this.simcPath}" ${input}`);
      return stdout;
    } catch (error) {
      throw new Error(`Simulation failed: ${error}`);
    }
  }
} 