import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as https from 'https';
import * as sevenZip from '7zip-min';
import { promisify } from 'util';
import { exec, spawn } from 'child_process';
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
    
    await fsPromises.mkdir(downloadPath, { recursive: true });
    await fsPromises.mkdir(installPath, { recursive: true });
    
    const filename = url.split('/').pop()!;
    const filePath = path.join(downloadPath, filename);
    
    await this.downloadFile(url, filePath);
    await extractFull(filePath, installPath);
    
    const simcPath = path.join(installPath, 'simc.exe');
    await fsPromises.unlink(filePath);
    
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

    const fileStream = fs.createWriteStream(destination);
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
  private buildPath: string;
  private simcPath: string;

  constructor() {
    this.buildPath = path.join(app.getPath('userData'), 'simc-build');
    this.simcPath = path.join(this.buildPath, 'simc');
  }

  private async detectPackageManager(): Promise<{
    name: 'APT' | 'DNF' | 'YUM';
    update: string;
    install: string;
  }> {
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
      }
    };

    for (const [name, pm] of Object.entries(PACKAGE_MANAGERS)) {
      try {
        await execAsync(pm.check);
        return {
          name: name as 'APT' | 'DNF' | 'YUM',
          update: pm.update,
          install: pm.install
        };
      } catch {
        continue;
      }
    }
    
    throw new Error('No supported package manager found. Please install dependencies manually.');
  }

  private async checkPackageManager(): Promise<string> {
    const pm = await this.detectPackageManager();
    BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
      `Detected package manager: ${pm.name}\n`);
    return `Detected package manager: ${pm.name}`;
  }

  private async handleDependencies(sudoPassword?: string): Promise<string> {
    logger.info('Starting dependency check...');
    BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 'Checking installed packages...\n');
    
    const pm = await this.detectPackageManager();
    const packages = [
      'git',
      'make',
      'cmake',
      'g++',
      pm.name === 'APT' ? 'libcurl4-openssl-dev' : 'libcurl-devel'
    ];

    // Always check what's missing first
    logger.info('Checking for packages:', packages);
    BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
      `Checking for required packages: ${packages.join(', ')}\n`);

    const missingPackages = await this.checkMissingPackages(packages, pm.name);
    
    if (missingPackages.length === 0) {
      const message = 'All required dependencies are already installed.';
      BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', `${message}\n`);
      logger.info(message);
      return message;
    }

    // Need sudo for package installation
    BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
      `Missing packages found: ${missingPackages.join(', ')}\n`);
    logger.info('Missing packages found:', missingPackages);
    
    if (!sudoPassword) {
      throw new Error('SUDO_REQUIRED');
    }

    try {
      // Verify sudo access first
      await this.runSudoCommand('true', sudoPassword);
      BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 'Sudo access verified\n');
      
      // Install missing packages
      BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 'Installing missing packages...\n');
      await this.runSudoCommand(`${pm.install} ${missingPackages.join(' ')}`, sudoPassword);
      
      const message = `Installed missing dependencies: ${missingPackages.join(', ')}`;
      BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', `${message}\n`);
      return message;
    } catch (error) {
      if (error instanceof Error && error.message === 'SUDO_AUTH_FAILED') {
        throw error;  // Re-throw auth failures
      }
      throw new Error(`Failed to install packages: ${error}`);
    }
  }

  private async handleRepository(isUpdate: boolean): Promise<string> {
    try {
      // Check if repository already exists
      const repoExists = fs.existsSync(this.simcPath);
      
      // If repo exists but we're in install mode, switch to update mode
      if (repoExists && !isUpdate) {
        BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
          'Repository already exists, switching to update mode...\n');
        isUpdate = true;
      }

      if (!isUpdate) {
        await fsPromises.mkdir(this.buildPath, { recursive: true });
      }

      return new Promise(async (resolve, reject) => {
        try {
          const command = isUpdate ? 'pull' : 'clone';
          
          // For updates, first get the default branch and ensure we're tracking it
          let args: string[];
          if (isUpdate) {
            // First fetch all remotes
            await execAsync('git fetch origin', { cwd: this.simcPath });
            BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 'Fetched latest changes\n');

            try {
              // Try to get the current remote default branch
              const { stdout: remoteHead } = await execAsync(
                'git symbolic-ref refs/remotes/origin/HEAD',
                { cwd: this.simcPath }
              );
              const remoteBranch = remoteHead.trim().replace('refs/remotes/origin/', '');
              
              // Get our current branch
              const { stdout: currentBranch } = await execAsync(
                'git rev-parse --abbrev-ref HEAD',
                { cwd: this.simcPath }
              );

              BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
                `Remote default branch is: ${remoteBranch}\n` +
                `Current branch is: ${currentBranch.trim()}\n`);

              // If we're not on the default branch, switch to it
              if (currentBranch.trim() !== remoteBranch) {
                BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
                  `Switching to new default branch: ${remoteBranch}\n`);
                await execAsync(`git checkout ${remoteBranch}`, { cwd: this.simcPath });
              }

              args = ['pull', 'origin', remoteBranch];
            } catch (error) {
              // If we can't determine the default branch, fall back to 'main'
              BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
                'Could not determine default branch, falling back to main\n');
              args = ['pull', 'origin', 'main'];
            }
          } else {
            args = ['clone', '--progress', 'https://github.com/simulationcraft/simc.git'];
          }

          const cwd = isUpdate ? this.simcPath : this.buildPath;

          BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
            `Running git ${command}...\n`);

          const child = spawn('git', args, { 
            cwd,
            stdio: ['ignore', 'pipe', 'pipe']
          });

          let output = '';
          let lineBuffer = '';

          const processChunk = (chunk: string) => {
            // Split on both newlines and carriage returns
            const lines = chunk.split(/[\r\n]+/);
            
            // If we have a partial line from before, prepend it
            if (lineBuffer) {
              lines[0] = lineBuffer + lines[0];
              lineBuffer = '';
            }
            
            // If the chunk doesn't end with a newline, store the partial line
            if (!chunk.endsWith('\n') && !chunk.endsWith('\r')) {
              lineBuffer = lines.pop() || '';
            }

            // Send each complete line
            lines.forEach(line => {
              if (line.trim()) {  // Only send non-empty lines
                BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', line + '\n');
                output += line + '\n';
              }
            });
          };

          child.stdout.on('data', (data) => {
            processChunk(data.toString());
          });

          child.stderr.on('data', (data) => {
            processChunk(data.toString());
          });

          child.on('close', (code) => {
            // Send any remaining buffered content
            if (lineBuffer) {
              BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', lineBuffer + '\n');
              output += lineBuffer + '\n';
            }

            if (code === 0) {
              BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
                `\nGit ${command} completed successfully.\n`);
              resolve(output);
            } else {
              const error = `Git ${command} failed with code ${code}`;
              BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
                `\n${error}\n`);
              reject(new Error(error));
            }
          });

          child.on('error', (error) => {
            BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
              `\nGit error: ${error.message}\n`);
            reject(error);
          });
        } catch (error) {
          BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
            `\nError: ${error instanceof Error ? error.message : String(error)}\n`);
          reject(error);
        }
      });
    } catch (error) {
      BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
        `\nError: ${error instanceof Error ? error.message : String(error)}\n`);
      throw error;
    }
  }

  private async handleBuild(): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn('make', ['-C', 'engine', 'OPENSSL=1', 'optimized'], {
        cwd: this.simcPath
      });

      let output = '';
      
      child.stdout.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', chunk);
      });

      child.stderr.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', chunk);
      });

      child.on('close', (code) => {
        if (code === 0) {
          BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
            '\nBuild completed successfully.\n');
          resolve(output);
        } else {
          const error = `Build failed with code ${code}`;
          BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
            `\n${error}\n`);
          reject(new Error(error));
        }
      });

      child.on('error', (error) => {
        BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
          `\nBuild error: ${error.message}\n`);
        reject(error);
      });
    });
  }

  async executeStep(step: number, isUpdate: boolean, sudoPassword?: string): Promise<string> {
    try {
      logger.info(`Executing step ${step} (${isUpdate ? 'update' : 'install'})`);

      switch (step) {
        case 0:
          return await this.checkPackageManager();
        case 1:
          return await this.handleDependencies(sudoPassword);
        case 2:
          return await this.handleRepository(isUpdate);
        case 3:
          return await this.handleBuild();
        default:
          throw new Error('Invalid step');
      }
    } catch (error) {
      logger.error(`Error executing step ${step}:`, error);
      throw error;
    }
  }

  private async checkMissingPackages(packages: string[], pmName: string): Promise<string[]> {
    const missing: string[] = [];
    
    for (const pkg of packages) {
      try {
        BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', `Checking ${pkg}...\n`);
        
        const command = pmName === 'APT'
          ? `dpkg-query -W -f='\${Status}' ${pkg} 2>/dev/null | grep -c "ok installed"`
          : `rpm -q ${pkg} 2>/dev/null`;
        
        await execAsync(command);
        BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', `${pkg} is installed\n`);
      } catch (error) {
        BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', `${pkg} is not installed\n`);
        missing.push(pkg);
      }
    }

    return missing;
  }

  async install(): Promise<string> {
    return this.simcPath;
  }

  async update(): Promise<void> {
    await this.install();
  }

  async getVersion(): Promise<SimcVersion | null> {
    try {
      const { stdout } = await execAsync('git rev-parse --short HEAD', { cwd: this.simcPath });
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

  private async runSudoCommand(command: string, sudoPassword?: string): Promise<string> {
    if (!sudoPassword) {
      throw new Error('SUDO_REQUIRED');
    }

    return new Promise((resolve, reject) => {
      const child = spawn('sudo', ['-S'].concat(command.split(' ')), {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdin.write(sudoPassword + '\n');
      child.stdin.end();

      child.stdout.on('data', (data) => {
        const chunk = data.toString();
        stdout += chunk;
        BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', chunk);
      });

      child.stderr.on('data', (data) => {
        const chunk = data.toString();
        stderr += chunk;
        // Check for sudo authentication failure
        if (chunk.includes('incorrect password')) {
          reject(new Error('SUDO_AUTH_FAILED'));
        } else {
          BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', chunk);
        }
      });

      child.on('close', async (code) => {
        if (code === 0) {
          try {
            // Only drop sudo privileges if the command succeeded
            await execAsync('sudo -k');
            BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 'Sudo privileges dropped\n');
            resolve(stdout);
          } catch (error) {
            logger.warn('Failed to drop sudo privileges:', error);
            // Still resolve since the main command succeeded
            resolve(stdout);
          }
        } else if (code === 1 && stderr.includes('incorrect password')) {
          reject(new Error('SUDO_AUTH_FAILED'));
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async checkMissingDependencies(): Promise<string[]> {
    logger.info('Starting dependency check...');
    BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 'Checking installed packages...\n');
    
    const pm = await this.detectPackageManager();
    const packages = [
      'git',
      'make',
      'cmake',
      'g++',
      pm.name === 'APT' ? 'libcurl4-openssl-dev' : 'libcurl-devel'
    ];

    logger.info('Checking for packages:', packages);
    BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
      `Checking for required packages: ${packages.join(', ')}\n`);

    const missingPackages = await this.checkMissingPackages(packages, pm.name);
    
    if (missingPackages.length === 0) {
      const message = 'All required dependencies are already installed.';
      BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', `${message}\n`);
      logger.info(message);
    } else {
      BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 
        `Missing packages found: ${missingPackages.join(', ')}\n`);
      logger.info('Missing packages found:', missingPackages);
    }

    return missingPackages;
  }

  async installDependencies(packages: string[], sudoPassword: string): Promise<string> {
    if (!sudoPassword) {
      throw new Error('SUDO_REQUIRED');
    }

    try {
      const pm = await this.detectPackageManager();

      // Verify sudo access first
      await this.runSudoCommand('true', sudoPassword);
      BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 'Sudo access verified\n');
      
      // Install packages
      BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', 'Installing packages...\n');
      await this.runSudoCommand(`${pm.install} ${packages.join(' ')}`, sudoPassword);
      
      const message = `Installed dependencies: ${packages.join(', ')}`;
      BrowserWindow.getAllWindows()[0].webContents.send('simc:progress', `${message}\n`);
      return message;
    } catch (error) {
      if (error instanceof Error && error.message === 'SUDO_AUTH_FAILED') {
        throw error;  // Re-throw auth failures
      }
      throw new Error(`Failed to install packages: ${error}`);
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