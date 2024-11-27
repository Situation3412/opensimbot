/**
 * Note: The "Failed to connect to the bus" errors on Linux are related to the
 * D-Bus connection and can be safely ignored. These errors occur when running
 * Electron in certain Linux environments without a desktop session.
 */

import { app, BrowserWindow, ipcMain, WebContents } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as remoteMain from '@electron/remote/main';
import { SimcManager } from './SimcManager';
import { SimcConfig } from './types';
import { logger } from './utils/logger';
import { SimcError, ConfigError } from './utils/errors';

logger.info('Starting Open SimBot...');

// Simple development check
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
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
      devTools: true  // Always enable DevTools for debugging
    }
  });

  remoteMain.enable(mainWindow.webContents);

  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '..', 'build', 'index.html')}`;
    
  logger.info('Loading URL:', startUrl);
  logger.info('Current directory:', __dirname);
  logger.info('Build path:', path.join(__dirname, '..', 'build'));

  mainWindow.loadURL(startUrl);

  // Always open DevTools in production too until we fix the issue
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    logger.error('Failed to load:', { errorCode, errorDescription, startUrl });
  });

  mainWindow.webContents.on('did-finish-load', () => {
    logger.info('Main window loaded');
  });

  (mainWindow.webContents as WebContents & { on(event: 'crashed', listener: (event: Event) => void): void })
    .on('crashed', (event: Event) => {
      logger.error('Renderer process crashed', event);
    });
}

app.whenReady().then(() => {
  logger.info('App ready, creating window...');
  createWindow();
}).catch(err => {
  logger.error('Error in app.whenReady:', err);
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('simc:checkInstallation', async () => {
  try {
    logger.info('Handling simc:checkInstallation');
    const result = await simcManager.performCheck();
    // Explicitly serialize the result
    return {
      needsInstall: !!result.needsInstall,
      needsUpdate: !!result.needsUpdate,
      currentVersion: result.currentVersion ? {
        major: result.currentVersion.major,
        minor: result.currentVersion.minor,
        patch: result.currentVersion.patch
      } : null
    };
  } catch (error) {
    logger.error('Error in checkInstallation:', error);
    // Return a serializable error object
    return {
      error: {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown Error'
      }
    };
  }
});

ipcMain.handle('simc:getVersion', async () => {
  console.log('Handling simc:getVersion');
  return simcManager.getInstalledVersion();
});

ipcMain.handle('simc:downloadLatest', async () => {
  console.log('Handling simc:downloadLatest');
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
    console.error('Error loading config:', error);
    throw error;
  }
});

ipcMain.handle('config:save', async (_, config: SimcConfig) => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  try {
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error saving config:', error);
    throw error;
  }
});

// Error handlers
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection:', error);
}); 