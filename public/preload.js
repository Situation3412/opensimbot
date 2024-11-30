const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  simcManager: {
    checkInstallation: () => ipcRenderer.invoke('simc:checkInstallation'),
    getVersion: () => ipcRenderer.invoke('simc:getVersion'),
    downloadLatest: () => ipcRenderer.invoke('simc:downloadLatest'),
    getPlatform: () => ipcRenderer.invoke('simc:getPlatform')
  },
  config: {
    load: () => ipcRenderer.invoke('config:load'),
    save: (config) => ipcRenderer.invoke('config:save', config)
  },
  simc: {
    runSingleSim: (params) => ipcRenderer.invoke('simc:runSingleSim', params),
    onProgress: (callback) => ipcRenderer.on('simc:progress', (_, data) => callback(data)),
    offProgress: () => ipcRenderer.removeAllListeners('simc:progress')
  }
});