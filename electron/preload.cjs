const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  getRealmlist$: () => ipcRenderer.invoke('getRealmlist$')
});
