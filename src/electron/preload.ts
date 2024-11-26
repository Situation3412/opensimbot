import { contextBridge, ipcRenderer } from 'electron';
import { SimcAPI } from './types';

console.log('Preload script is running');

const api: SimcAPI = {
  simcManager: {
    checkInstallation: () => {
      console.log('Calling checkInstallation');
      return ipcRenderer.invoke('simc:checkInstallation');
    },
    getVersion: () => ipcRenderer.invoke('simc:getVersion'),
    downloadLatest: () => ipcRenderer.invoke('simc:downloadLatest'),
  },
  config: {
    load: () => ipcRenderer.invoke('config:load'),
    save: (config) => ipcRenderer.invoke('config:save', config),
  }
};

contextBridge.exposeInMainWorld('electron', api); 