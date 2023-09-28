const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  startClient$: (realmlistPath) => ipcRenderer.invoke('startClient$', realmlistPath),
  getRealmlist$: (source) => ipcRenderer.invoke('getRealmlist$', source),
  getRealmlists$: () => ipcRenderer.invoke('getRealmlists$'),
  saveRealmlists$: (realmlists) => ipcRenderer.invoke('saveRealmlists$', realmlists),
  setRealmlist$: (realmlist) => ipcRenderer.invoke('setRealmlist$', realmlist)
});
