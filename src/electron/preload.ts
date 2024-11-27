import { contextBridge, ipcRenderer } from 'electron';
import { SimcAPI } from './types';

console.log('Preload script starting...');

const api: SimcAPI = {
  simcManager: {
    checkInstallation: () => {
      console.log('Calling checkInstallation from preload');
      return ipcRenderer.invoke('simc:checkInstallation')
        .catch(err => {
          console.error('Error in checkInstallation:', err);
          throw err;
        });
    },
    getVersion: () => {
      console.log('Calling getVersion from preload');
      return ipcRenderer.invoke('simc:getVersion')
        .catch(err => {
          console.error('Error in getVersion:', err);
          throw err;
        });
    },
    downloadLatest: () => {
      console.log('Calling downloadLatest from preload');
      return ipcRenderer.invoke('simc:downloadLatest')
        .catch(err => {
          console.error('Error in downloadLatest:', err);
          throw err;
        });
    },
  },
  config: {
    load: () => {
      console.log('Calling config.load from preload');
      return ipcRenderer.invoke('config:load')
        .catch(err => {
          console.error('Error in config.load:', err);
          throw err;
        });
    },
    save: (config) => {
      console.log('Calling config.save from preload');
      return ipcRenderer.invoke('config:save', config)
        .catch(err => {
          console.error('Error in config.save:', err);
          throw err;
        });
    },
  },
  simc: {
    runSingleSim: (params: { input: string, iterations: number, threads: number }) => 
      ipcRenderer.invoke('simc:runSingleSim', params),
    onProgress: (callback: (output: string) => void) => {
      ipcRenderer.on('simc:progress', (_event, output) => callback(output));
    },
    offProgress: () => {
      ipcRenderer.removeAllListeners('simc:progress');
    }
  }
};

try {
  contextBridge.exposeInMainWorld('electron', api);
  console.log('API exposed successfully');
} catch (err) {
  console.error('Failed to expose API:', err);
} 