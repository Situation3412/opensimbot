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
    executeLinuxBuildStep: (params) => {
      console.log('Calling executeLinuxBuildStep from preload');
      return ipcRenderer.invoke('simc:executeLinuxBuildStep', params)
        .catch(err => {
          console.error('Error in executeLinuxBuildStep:', err);
          throw err;
        });
    },
    getPlatform: () => {
      return ipcRenderer.invoke('simc:getPlatform');
    },
    checkMissingDependencies: () => {
      console.log('Calling checkMissingDependencies from preload');
      return ipcRenderer.invoke('simc:checkMissingDependencies')
        .catch(err => {
          console.error('Error in checkMissingDependencies:', err);
          throw err;
        });
    },
    installDependencies: (params) => {
      console.log('Calling installDependencies from preload');
      return ipcRenderer.invoke('simc:installDependencies', params)
        .catch(err => {
          console.error('Error in installDependencies:', err);
          throw err;
        });
    }
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