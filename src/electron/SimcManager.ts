import { app } from 'electron';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as sevenZip from '7zip-min';
import { promisify as utilPromisify } from 'util';
const extractFull = utilPromisify(sevenZip.unpack);
import { SimcVersion, SimcState } from './types';
import { SimcError } from './utils/errors';
import { logger } from './utils/logger';

const execAsync = promisify(exec);
const SIMC_DOWNLOAD_BASE = 'http://downloads.simulationcraft.org/nightly/';
const LINUX_BUILD_INSTRUCTIONS = `
SimulationCraft for Linux needs to be built from source.
Please visit: https://github.com/simulationcraft/simc/wiki/HowToBuild
`;

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

  private getLatestVersionFromWeb(): Promise<{ version: SimcVersion, url: string }> {
    return new Promise((resolve, reject) => {
      http.get(SIMC_DOWNLOAD_BASE, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            // Parse the HTML to find the latest version
            const versionRegex = /simc-(\d+)\.(\d+)\.(\d+)/;
            const matches = data.match(versionRegex);
            if (!matches) {
              throw new Error('Could not find version information');
            }

            const version = {
              major: parseInt(matches[1]),
              minor: parseInt(matches[2]),
              patch: parseInt(matches[3])
            };

            // Find the appropriate download URL based on platform
            const platform = process.platform;
            const arch = process.arch;
            let filename = '';

            if (platform === 'win32') {
              filename = arch === 'x64' 
                ? `simc-${version.major}${version.minor}${version.patch}.01-win64.7z`
                : `simc-${version.major}${version.minor}${version.patch}.01-win32.7z`;
            } else if (platform === 'darwin') {
              filename = `simc-${version.major}${version.minor}${version.patch}.01-macos.dmg`;
            } else if (platform === 'linux') {
              throw new Error(LINUX_BUILD_INSTRUCTIONS);
            } else {
              throw new Error('Unsupported platform');
            }

            resolve({
              version,
              url: `${SIMC_DOWNLOAD_BASE}${filename}`
            });
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', reject);
    });
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
        logger.debug('SimC not found in PATH');
      }

      logger.info('SimC not found in any location');
      return null;
    } catch (error) {
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

    try {
      const { version } = await this.getLatestVersionFromWeb();
      return version.major > currentVersion.major ||
             version.minor > currentVersion.minor ||
             version.patch > currentVersion.patch;
    } catch (error) {
      logger.error('Error checking for updates:', error);
      return false;
    }
  }

  async downloadLatestVersion(): Promise<void> {
    try {
      const { version, url } = await this.getLatestVersionFromWeb();
      const downloadPath = path.join(app.getPath('userData'), 'downloads');
      const installPath = path.join(app.getPath('userData'), 'simc');
      
      // Create necessary directories
      await fs.promises.mkdir(downloadPath, { recursive: true });
      await fs.promises.mkdir(installPath, { recursive: true });

      const filename = url.split('/').pop()!;
      const filePath = path.join(downloadPath, filename);

      logger.info(`Downloading SimC version ${version.major}.${version.minor}.${version.patch}`);
      logger.info(`Download URL: ${url}`);
      logger.info(`Saving to: ${filePath}`);

      // Download the file
      await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        https.get(url, response => {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(void 0);
          });
        }).on('error', error => {
          fs.unlink(filePath, () => {
            reject(error);
          });
        });
      });

      logger.info('Download complete, extracting...');

      // Extract the archive
      try {
        await extractFull(filePath, installPath);
        logger.info('Extraction complete');
      } catch (err) {
        logger.error('Extraction failed:', err);
        throw err;
      }

      // Find the simc executable in the extracted files
      const simcExe = process.platform === 'win32' ? 'simc.exe' : 'simc';
      const simcPath = path.join(installPath, simcExe);

      // Update state
      this.simcPath = simcPath;
      await this.saveState({
        lastCheckTime: Date.now(),
        installedVersion: version,
        simcPath: simcPath
      });

      // Cleanup downloaded file
      await fs.promises.unlink(filePath);

      logger.info('Installation complete');
    } catch (error) {
      logger.error('Error downloading/installing SimC:', error);
      throw error;
    }
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