import { contextBridge, ipcRenderer } from 'electron';
import { SimcAPI, SimcVersion } from './types';

const api: SimcAPI = {
  simcManager: {
    checkInstallation: () => {
      return ipcRenderer.invoke('simc:checkInstallation');
    },
    getVersion: () => {
      return ipcRenderer.invoke('simc:getVersion');
    },
    downloadLatest: () => {
      return ipcRenderer.invoke('simc:downloadLatest');
    },
    executeLinuxBuildStep: (params) => {
      return ipcRenderer.invoke('simc:executeLinuxBuildStep', params);
    },
    getPlatform: () => {
      return ipcRenderer.invoke('simc:getPlatform');
    },
    checkMissingDependencies: () => {
      return ipcRenderer.invoke('simc:checkMissingDependencies');
    },
    installDependencies: (params) => {
      return ipcRenderer.invoke('simc:installDependencies', params);
    }
  },
  config: {
    load: () => {
      return ipcRenderer.invoke('config:load');
    },
    save: (config) => {
      return ipcRenderer.invoke('config:save', config);
    },
  },
  simc: {
    runSingleSim: (params) => {
      return ipcRenderer.invoke('simc:runSingleSim', params);
    },
    onProgress: (callback) => {
      ipcRenderer.on('simc:progress', (_, output) => callback(output));
    },
    offProgress: () => {
      ipcRenderer.removeAllListeners('simc:progress');
    }
  }
};

contextBridge.exposeInMainWorld('electron', api); 