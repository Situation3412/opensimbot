import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
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
  install(progressCallback?: (status: string, progress: number) => void): Promise<string>;
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
    try {
      // Fetch the nightly builds page
      const response = await fetch(SIMC_DOWNLOAD_BASE);
      const html = await response.text();
      
      // Find the latest Windows build (you may want to use a proper HTML parser)
      const match = html.match(/simc-\d+\-\d+\-win64\.7z/);
      if (!match) {
        throw new DownloadError('No Windows build found');
      }
      
      const filename = match[0];
      const version = this.parseVersionFromFilename(filename);
      
      return {
        version,
        url: `${SIMC_DOWNLOAD_BASE}${filename}`
      };
    } catch (error) {
      throw new DownloadError(`Failed to get latest version: ${error}`);
    }
  }

  private async downloadFile(url: string, destination: string): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new DownloadError(`Failed to download: ${response.statusText}`);
    }
    
    if (!response.body) {
      throw new DownloadError('Response body is null');
    }

    const fileStream = fsSync.createWriteStream(destination);
    const reader = response.body.getReader();
    
    await new Promise<void>((resolve, reject) => {
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fileStream.write(value);
          }
          fileStream.end();
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      
      pump();
      fileStream.on('error', reject);
    });
  }

  private parseVersionFromFilename(filename: string): SimcVersion {
    const match = filename.match(/simc-(\d+)-(\d+)/);
    if (!match) {
      throw new DownloadError('Invalid filename format');
    }
    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: 0
    };
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
      const buildPath = path.join(app.getPath('userData'), 'simc-build/simc');
      const { stdout } = await execAsync('git rev-parse --short HEAD', { cwd: buildPath });
      return {
        major: 0,
        minor: 0,
        patch: 0,
        gitVersion: stdout.trim()
      };
    } catch (error) {
      logger.warn('Failed to get git version:', error);
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