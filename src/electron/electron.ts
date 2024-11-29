/**
 * Note: The "Failed to connect to the bus" errors on Linux are related to the
 * D-Bus connection and can be safely ignored. These errors occur when running
 * Electron in certain Linux environments without a desktop session.
 */

import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as remoteMain from '@electron/remote/main';
import { SimcManager } from './SimcManager';
import { SimcConfig } from './types';
import { logger } from './utils/logger';
import { createSimcInstaller, LinuxSimcInstaller } from './installers/SimcInstaller';

logger.info('Starting Open SimBot...');

const isDev = process.env.NODE_ENV === 'development' || process.defaultApp;

remoteMain.initialize();
logger.info('Remote initialized');

const simcManager = new SimcManager();

let checkInstallationTimeout: NodeJS.Timeout | null = null;

function createWindow() {
  logger.debug('Creating main window...');
  
  const preloadPath = path.join(__dirname, 'preload.js');
  logger.debug('Preload path:', preloadPath);
  
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
      devTools: true
    }
  });

  // Let the app follow system theme
  nativeTheme.themeSource = 'system';

  remoteMain.enable(mainWindow.webContents);

  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '..', 'build', 'index.html')}`;
    
  logger.info('Loading URL:', startUrl);
  logger.info('Current directory:', __dirname);
  logger.info('Build path:', path.join(__dirname, '..', 'build'));

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  nativeTheme.on('updated', () => {
    const isDark = nativeTheme.shouldUseDarkColors;
    mainWindow.webContents.send('theme-changed', isDark ? 'dark' : 'light');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    logger.error('Failed to load:', { errorCode, errorDescription, startUrl });
  });

  mainWindow.webContents.on('did-finish-load', () => {
    logger.info('Main window loaded');
  });
}

app.whenReady().then(() => {
  logger.info('App ready, creating window...');
  createWindow();
}).catch(err => {
  logger.error('Error in app.whenReady:', err);
});

app.on('window-all-closed', () => {
  logger.info('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  logger.info('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('simc:checkInstallation', async () => {
  try {
    const manager = new SimcManager();
    const result = await manager.checkInstallation();
    logger.info('Sending checkInstallation result:', result);
    return result;
  } catch (error) {
    logger.error('Error in checkInstallation handler:', error);
    throw error;
  }
});

ipcMain.handle('simc:getVersion', async () => {
  return simcManager.getInstalledVersion();
});

ipcMain.handle('simc:downloadLatest', async () => {
  return simcManager.downloadLatestVersion();
});

ipcMain.handle('config:load', async () => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  try {
    if (fs.existsSync(configPath)) {
      const data = await fs.promises.readFile(configPath, 'utf8');
      return JSON.parse(data);
    }
    return {
      simcPath: null,
      iterations: 10000,
      threads: Math.max(1, require('os').cpus().length - 1)
    };
  } catch (error) {
    logger.error('Error loading config:', error);
    throw error;
  }
});

ipcMain.handle('config:save', async (_, config: SimcConfig) => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  try {
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    logger.error('Error saving config:', error);
    throw error;
  }
});

ipcMain.handle('simc:runSingleSim', async (event, params: { input: string, iterations: number, threads: number }) => {
  try {
    logger.info('Running single sim with params:', params);
    const result = await simcManager.runSingleSim(params);
    logger.info('Sim result:', result);
    return result;
  } catch (error) {
    logger.error('Error running simulation:', error);
    return {
      dps: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
});

ipcMain.handle('simc:executeLinuxBuildStep', async (_, params: { 
  step: number, 
  isUpdate: boolean,
  sudoPassword?: string
}) => {
  try {
    const installer = createSimcInstaller() as LinuxSimcInstaller;
    return await installer.executeStep(params.step, params.isUpdate, params.sudoPassword);
  } catch (error) {
    logger.error('Error executing Linux build step:', error);
    
    if (error instanceof Error) {
      throw error.message;
    }
    throw String(error);
  }
});

ipcMain.handle('simc:getPlatform', () => {
  logger.info('Getting platform:', process.platform);
  return process.platform;
});

ipcMain.handle('simc:checkMissingDependencies', async () => {
  try {
    const installer = createSimcInstaller() as LinuxSimcInstaller;
    return await installer.checkMissingDependencies();
  } catch (error) {
    logger.error('Error checking dependencies:', error);
    throw String(error);
  }
});

ipcMain.handle('simc:installDependencies', async (_, params: { 
  packages: string[], 
  sudoPassword: string 
}) => {
  try {
    const installer = createSimcInstaller() as LinuxSimcInstaller;
    return await installer.installDependencies(params.packages, params.sudoPassword);
  } catch (error) {
    logger.error('Error installing dependencies:', error);
    if (error instanceof Error) {
      throw error.message;
    }
    throw String(error);
  }
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection:', error);
});
  