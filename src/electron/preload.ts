import { contextBridge } from 'electron';
import { SimcManager } from './SimcManager';
import { ConfigManager } from './ConfigManager';
import { SimcConfig, SimulationParams, SimulationResult } from './types';

const simcManager = new SimcManager();
const configManager = new ConfigManager();

contextBridge.exposeInMainWorld('electron', {
  simcManager: {
    checkInstallation: () => simcManager.checkInstallation(),
    getVersion: () => simcManager.getInstalledVersion(),
    downloadLatest: () => simcManager.downloadLatestVersion(),
    getPlatform: () => simcManager.getPlatform()
  },
  config: {
    load: () => configManager.load(),
    save: (config: SimcConfig) => configManager.save(config)
  },
  simc: {
    runSingleSim: (params: SimulationParams) => simcManager.runSingleSim(params),
    onProgress: (callback: (output: string) => void) => {
      const { ipcRenderer } = require('electron');
      ipcRenderer.on('simc:progress', (_, data) => callback(data));
    },
    offProgress: () => {
      const { ipcRenderer } = require('electron');
      ipcRenderer.removeAllListeners('simc:progress');
    }
  }
}); 