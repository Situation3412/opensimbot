import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { createSimcInstaller } from './installers/SimcInstaller';
import { logger } from './utils/logger';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: isDev
        ? path.join(__dirname, '..', 'src', 'electron', 'preload.js')
        : path.join(__dirname, 'preload.js'),
      sandbox: false
    }
  });

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load app:', errorCode, errorDescription);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
  