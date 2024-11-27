import { app } from 'electron';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as sevenZip from '7zip-min';
import { SimcVersion, SimcState } from './types';
import { SimcError } from './utils/errors';
import { logger } from './utils/logger';

const execAsync = promisify(exec);
const extractFull = promisify(sevenZip.unpack);
const SIMC_DOWNLOAD_BASE = 'http://downloads.simulationcraft.org/nightly/';

export const LINUX_BUILD_INSTRUCTIONS = `
SimulationCraft for Linux needs to be built from source.

Required dependencies:
- git
- make
- cmake
- g++
- libcurl4-openssl-dev

Build steps:
1. Update package manager:
   sudo apt-get update

2. Install dependencies:
   sudo apt-get install -y git make cmake g++ libcurl4-openssl-dev

3. Clone and build:
   git clone https://github.com/simulationcraft/simc.git
   cd simc
   make -C engine OPENSSL=1 optimized
   sudo ln -s "$(pwd)/engine/simc" /usr/local/bin/simc

The installer will handle these steps automatically.
`;

const PACKAGE_MANAGERS = {
  APT: {
    check: 'which apt-get',
    update: 'sudo apt-get update',
    install: 'sudo apt-get install -y'
  },
  DNF: {
    check: 'which dnf',
    update: 'sudo dnf check-update',
    install: 'sudo dnf install -y'
  },
  YUM: {
    check: 'which yum',
    update: 'sudo yum check-update',
    install: 'sudo yum install -y'
  },
  PACMAN: {
    check: 'which pacman',
    update: 'sudo pacman -Sy',
    install: 'sudo pacman -S --noconfirm'
  },
  ZYPPER: {
    check: 'which zypper',
    update: 'sudo zypper refresh',
    install: 'sudo zypper install -y'
  }
};

const DEPENDENCIES = {
  APT: [
    'git',
    'make',
    'cmake',
    'g++',
    'libcurl4-openssl-dev',  // Debian/Ubuntu package name
    'libssl-dev'             // Debian/Ubuntu package name
  ],
  DNF: [
    'git',
    'make',
    'cmake',
    'gcc-c++',
    'libcurl-devel',
    'openssl-devel'
  ],
  YUM: [
    'git',
    'make',
    'cmake',
    'gcc-c++',
    'libcurl-devel',
    'openssl-devel'
  ],
  PACMAN: [
    'git',
    'make',
    'cmake',
    'gcc',
    'curl',
    'openssl'
  ],
  ZYPPER: [
    'git',
    'make',
    'cmake',
    'gcc-c++',
    'libcurl-devel',
    'libopenssl-devel'
  ]
};

async function detectPackageManager() {
  for (const [name, pm] of Object.entries(PACKAGE_MANAGERS)) {
    try {
      await execAsync(pm.check);
      return { name, ...pm };
    } catch {
      continue;
    }
  }
  throw new Error('No supported package manager found');
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
      if (process.platform === 'linux') {
        const buildPath = path.join(app.getPath('userData'), 'simc-build');
        const simcPath = path.join(buildPath, 'simc');
        
        if (fs.existsSync(simcPath)) {
          process.chdir(simcPath);
          const { stdout: commitHash } = await execAsync('git rev-parse --short HEAD');
          
          const version = {
            major: 0,
            minor: 0,
            patch: 0,
            gitVersion: commitHash.trim()
          };
          
          logger.info('Linux: Using git version:', version);
          return version;
        }
        logger.warn('Linux: SimC repository not found at:', simcPath);
        return null;
      }

      // For Windows/Mac, parse the version from simc output
      const { stdout } = await execAsync(`"${this.simcPath}"`);

      // Parse version like "SimulationCraft 1100-02 for World of Warcraft 11.0.5.57689 Live"
      const versionMatch = stdout.match(/SimulationCraft (\d+)-(\d+) for World of Warcraft/i);
      if (versionMatch) {
        const fullVersion = versionMatch[1]; // e.g., "1100"
        const patch = parseInt(versionMatch[2]); // e.g., "02"
        
        const major = Math.floor(parseInt(fullVersion) / 100);
        const minor = parseInt(fullVersion) % 100;

        const version = {
          major,
          minor,
          patch
        };
        logger.info('Found SimC version:', version);
        return version;
      }
      logger.warn('Could not parse version from SimC output');
      return null;
    } catch (error) {
      logger.error('Error getting SimC version:', error);
      return null;
    }
  }

  async checkForUpdates(): Promise<boolean> {
    const currentVersion = await this.getInstalledVersion();
    logger.info('Current version:', currentVersion);
    
    if (!currentVersion) {
      logger.info('No current version found, update needed');
      return true;
    }

    try {
      // For Linux, check git repository
      if (process.platform === 'linux') {
        const buildPath = path.join(app.getPath('userData'), 'simc-build');
        const simcPath = path.join(buildPath, 'simc');
        
        if (fs.existsSync(simcPath)) {
          process.chdir(simcPath);
          await execAsync('git fetch');
          const { stdout: statusOut } = await execAsync('git status -uno');
          logger.info('Git status:', statusOut);
          return statusOut.includes('behind');
        }
        return true;
      }

      // For other platforms, check web version
      const { version: latestVersion } = await this.getLatestVersionFromWeb();
      logger.info('Latest version:', latestVersion);
      
      const needsUpdate = latestVersion.major > currentVersion.major ||
                         latestVersion.minor > currentVersion.minor ||
                         latestVersion.patch > currentVersion.patch;
      
      logger.info('Needs update:', needsUpdate);
      return needsUpdate;
    } catch (error) {
      logger.error('Error checking for updates:', error);
      return false;
    }
  }

  async buildFromSource(): Promise<void> {
    if (process.platform !== 'linux') {
      throw new Error('Building from source is only supported on Linux');
    }

    logger.info('Starting SimC build from source');
    const buildPath = path.join(app.getPath('userData'), 'simc-build');
    const simcPath = path.join(buildPath, 'simc');

    try {
      // Detect package manager first
      const pm = await detectPackageManager();
      logger.info(`Using package manager: ${pm.name}`);

      // Create build directory if it doesn't exist
      if (!fs.existsSync(buildPath)) {
        logger.info('Creating build directory...');
        await fs.promises.mkdir(buildPath, { recursive: true });
      }

      // Install dependencies with better error handling
      logger.info('Installing dependencies...');
      const deps = DEPENDENCIES[pm.name as keyof typeof DEPENDENCIES] || DEPENDENCIES.APT;
      logger.info(`Installing: ${deps.join(' ')}`);
      
      try {
        await execAsync(`${pm.update}`); // Update package lists first
        const { stdout: installOut, stderr: installErr } = await execAsync(`${pm.install} ${deps.join(' ')}`);
        if (installErr) logger.warn('Install stderr:', installErr);
      } catch (error) {
        throw new Error(`Failed to install dependencies: ${error instanceof Error ? error.message : String(error)}`);
      }

      // Clone or update SimC repository
      if (fs.existsSync(simcPath)) {
        logger.info('Updating existing SimC repository...');
        process.chdir(simcPath);
        await execAsync('git fetch');
        const { stdout: statusOut } = await execAsync('git status -uno');
        
        if (statusOut.includes('behind')) {
          logger.info('Updates available, pulling changes...');
          await execAsync('git pull');
        } else {
          logger.info('SimC is up to date');
          return; // Skip rebuild if no updates
        }
      } else {
        logger.info('Cloning SimC repository...');
        process.chdir(buildPath);
        await execAsync('git clone https://github.com/simulationcraft/simc.git');
        process.chdir(simcPath);
      }

      // Build SimC
      logger.info('Building SimC...');
      const { stdout: makeOut, stderr: makeErr } = await execAsync('make -C engine OPENSSL=1 optimized');
      if (makeErr) logger.warn('Make stderr:', makeErr);

      // Create symlink
      logger.info('Creating symlink...');
      await execAsync('sudo ln -sf "$(pwd)/engine/simc" /usr/local/bin/simc');

      // Update state
      this.simcPath = '/usr/local/bin/simc';
      const version = await this.getInstalledVersion();
      await this.saveState({
        lastCheckTime: Date.now(),
        installedVersion: version,
        simcPath: this.simcPath
      });

      logger.info('Build completed successfully');
    } catch (error) {
      logger.error('Build failed:', error);
      throw new Error(`Build failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async downloadLatestVersion(): Promise<void> {
    logger.info('Starting downloadLatestVersion...');
    
    if (process.platform === 'linux') {
      logger.info('Linux platform detected, switching to buildFromSource...');
      return this.buildFromSource();
    }

    try {
      logger.info('Getting latest version info...');
      const { version, url } = await this.getLatestVersionFromWeb();
      logger.info(`Latest version: ${version.major}.${version.minor}.${version.patch}`);
      
      const downloadPath = path.join(app.getPath('userData'), 'downloads');
      const installPath = path.join(app.getPath('userData'), 'simc');
      
      logger.info(`Download path: ${downloadPath}`);
      logger.info(`Install path: ${installPath}`);
      
      // Create necessary directories
      logger.info('Creating directories...');
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
            logger.info('Download finished');
            file.close();
            resolve(void 0);
          });
          file.on('error', (err) => {
            logger.error('File write error:', err);
            reject(err);
          });
        }).on('error', error => {
          logger.error('Download error:', error);
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

      logger.info(`Setting SimC path to: ${simcPath}`);

      // Update state
      this.simcPath = simcPath;
      await this.saveState({
        lastCheckTime: Date.now(),
        installedVersion: version,
        simcPath: simcPath
      });

      // Cleanup downloaded file
      logger.info('Cleaning up downloaded file...');
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

      const result = {
        needsInstall: !this.simcPath,
        needsUpdate,
        currentVersion: currentVersion ? {
          ...currentVersion,
          major: currentVersion.major,
          minor: currentVersion.minor,
          patch: currentVersion.patch,
          gitVersion: currentVersion.gitVersion
        } : null
      };

      logger.info('SimC status:', {
        installed: !!this.simcPath,
        needsUpdate,
        version: currentVersion
      });

      return result;
    } catch (error) {
      logger.error('Error checking SimC:', error);
      throw new SimcError(
        error instanceof Error ? error.message : String(error)
      );
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