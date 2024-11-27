import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as https from 'https';
import * as sevenZip from '7zip-min';
import { promisify } from 'util';
import { exec } from 'child_process';
import { SimcVersion } from '../types';
import { DownloadError, BuildError, InstallationError } from '../utils/errors';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);
const extractFull = promisify(sevenZip.unpack);

const SIMC_DOWNLOAD_BASE = 'http://downloads.simulationcraft.org/nightly/';

export interface SimcInstaller {
  install(): Promise<string>;  // Returns path to simc executable
  update(): Promise<void>;
  getVersion(): Promise<SimcVersion | null>;
}

export class WindowsSimcInstaller implements SimcInstaller {
  async install(): Promise<string> {
    const { version, url } = await this.getLatestVersion();
    const downloadPath = path.join(app.getPath('userData'), 'downloads');
    const installPath = path.join(app.getPath('userData'), 'simc');
    
    await fs.mkdir(downloadPath, { recursive: true });
    await fs.mkdir(installPath, { recursive: true });
    
    const filename = url.split('/').pop()!;
    const filePath = path.join(downloadPath, filename);
    
    await this.downloadFile(url, filePath);
    await extractFull(filePath, installPath);
    
    const simcPath = path.join(installPath, 'simc.exe');
    await fs.unlink(filePath);
    
    return simcPath;
  }

  async update(): Promise<void> {
    await this.install();
  }

  async getVersion(): Promise<SimcVersion | null> {
    // Implementation
    return null;
  }

  private async getLatestVersion(): Promise<{ version: SimcVersion; url: string }> {
    // Implementation
    throw new Error('Not implemented');
  }

  private async downloadFile(url: string, destination: string): Promise<void> {
    // Implementation
    throw new Error('Not implemented');
  }
}

export class MacSimcInstaller implements SimcInstaller {
  async install(): Promise<string> {
    // Similar to Windows implementation but with .dmg handling
    throw new Error('Not implemented');
  }

  async update(): Promise<void> {
    await this.install();
  }

  async getVersion(): Promise<SimcVersion | null> {
    return null;
  }
}

export class LinuxSimcInstaller implements SimcInstaller {
  async install(): Promise<string> {
    const buildPath = path.join(app.getPath('userData'), 'simc-build');
    await fs.mkdir(buildPath, { recursive: true });
    
    // Clone repo
    await execAsync('git clone https://github.com/simulationcraft/simc.git', { cwd: buildPath });
    
    // Build
    const simcPath = path.join(buildPath, 'simc');
    await execAsync('make -C engine OPENSSL=1 optimized', { cwd: simcPath });
    
    // Create symlink
    const binPath = '/usr/local/bin/simc';
    await execAsync(`sudo ln -sf "${path.join(simcPath, 'engine/simc')}" "${binPath}"`);
    
    return binPath;
  }

  async update(): Promise<void> {
    const buildPath = path.join(app.getPath('userData'), 'simc-build/simc');
    await execAsync('git pull', { cwd: buildPath });
    await execAsync('make -C engine OPENSSL=1 optimized', { cwd: buildPath });
  }

  async getVersion(): Promise<SimcVersion | null> {
    try {
      const { stdout } = await execAsync('git rev-parse --short HEAD');
      return {
        major: 0,
        minor: 0,
        patch: 0,
        gitVersion: stdout.trim()
      };
    } catch {
      return null;
    }
  }
}

export function createSimcInstaller(): SimcInstaller {
  switch (process.platform) {
    case 'win32':
      return new WindowsSimcInstaller();
    case 'darwin':
      return new MacSimcInstaller();
    case 'linux':
      return new LinuxSimcInstaller();
    default:
      throw new InstallationError(`Unsupported platform: ${process.platform}`);
  }
} 