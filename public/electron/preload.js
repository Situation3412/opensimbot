"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
console.log('Preload script is running');
var api = {
    simcManager: {
        checkInstallation: function () {
            console.log('Calling checkInstallation');
            return electron_1.ipcRenderer.invoke('simc:checkInstallation');
        },
        getVersion: function () { return electron_1.ipcRenderer.invoke('simc:getVersion'); },
        downloadLatest: function () { return electron_1.ipcRenderer.invoke('simc:downloadLatest'); },
    },
    config: {
        load: function () { return electron_1.ipcRenderer.invoke('config:load'); },
        save: function (config) { return electron_1.ipcRenderer.invoke('config:save', config); },
    }
};
electron_1.contextBridge.exposeInMainWorld('electron', api);
//# sourceMappingURL=preload.js.map