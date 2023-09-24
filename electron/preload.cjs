const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  getRealmlist$: (source) => ipcRenderer.invoke('getRealmlist$', source),
  getRealmlists$: () => ipcRenderer.invoke('getRealmlists$'),
  saveRealmlists$: (realmlists) => ipcRenderer.invoke('saveRealmlists$', realmlists),
  setRealmlist$: (realmlist) => ipcRenderer.invoke('setRealmlist$', realmlist)
});
