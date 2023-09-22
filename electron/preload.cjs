const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  getRealmlist$: (source) => ipcRenderer.invoke('getRealmlist$', source)
});
