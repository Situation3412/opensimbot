const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
const { SimcManager } = require('../dist/electron/SimcManager');
const { ConfigManager } = require('../dist/electron/ConfigManager');

const simcManager = new SimcManager();
const configManager = new ConfigManager();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }
}

// IPC Handlers
ipcMain.handle('simc:checkInstallation', () => simcManager.checkInstallation());
ipcMain.handle('simc:getVersion', () => simcManager.getInstalledVersion());
ipcMain.handle('simc:downloadLatest', () => simcManager.downloadLatestVersion());
ipcMain.handle('simc:getPlatform', () => simcManager.getPlatform());
ipcMain.handle('simc:runSingleSim', (_, params) => simcManager.runSingleSim(params));
ipcMain.handle('config:load', () => configManager.load());
ipcMain.handle('config:save', (_, config) => configManager.save(config));

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