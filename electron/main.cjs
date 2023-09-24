const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const path = require('node:path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const DATA_PATH = path.join(__dirname, '..', 'data');
const CONFIG_PATH = path.join(DATA_PATH, 'config.json');
const REALMLISTS_PATH = path.join(DATA_PATH, 'realmlists.json');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  if (app.isPackaged) {
    Menu.setApplicationMenu(null);
    mainWindow.loadFile('../src/app.html');
  }
  else {
    mainWindow.loadURL('http://localhost:5173');
  }
};

const createDataFolder = () => {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      fs.mkdirSync(DATA_PATH);
    }
    if (!fs.existsSync(CONFIG_PATH)) {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify({ path: '', content: '' }, null, 2));
    }
    if (!fs.existsSync(REALMLISTS_PATH)) {
      fs.writeFileSync(REALMLISTS_PATH, JSON.stringify([]), null, 2);
    }
  }
  catch (error) {
    console.error(error);
  }
};

app.whenReady().then(() => {
  ipcMain.handle('getRealmlist$', (e, source) => getRealmlist$(source));
  ipcMain.handle('getRealmlists$', () => getRealmlists$());
  ipcMain.handle('saveRealmlists$', (e, realmlists) => saveRealmlists$(realmlists));
  ipcMain.handle('setRealmlist$', (e, realmlist) => setRealmlist$(realmlist));

  createWindow();
  createDataFolder();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/* ========================================================================= */

const getRealmlist$ = async (source) => {
  let realmlist = { path: '', content: '' };
  if (source === 'config') {
    realmlist = await readFile$(CONFIG_PATH, true);
  }
  else {
    const { canceled, filePaths } = await dialog.showOpenDialog({ filters: [{ name: 'Realmlist', extensions: ['wtf'] }] });
    if (!canceled) {
      const realmlistPath = filePaths[0];
      const realmlistContent = await readFile$(realmlistPath);
      realmlist = { path: realmlistPath, content: realmlistContent.trim() };
      // Cache realmlist
      await writeFile$(CONFIG_PATH, realmlist, true);
    }
  }
  return realmlist;
};

const getRealmlists$ = async () => {
  const realmlists = await readFile$(REALMLISTS_PATH, true);
  return realmlists;
};

const saveRealmlists$ = async (realmlists) => {
  // Order alphabetically by server name
  const orderedRealmlists = structuredClone(realmlists).sort((a, b) => {
    const aServer = a.server.toLowerCase();
    const bServer = b.server.toLowerCase();
    if (aServer < bServer) return -1;
    if (aServer > bServer) return 1;
    return 0;
  });
  await writeFile$(REALMLISTS_PATH, orderedRealmlists, true);
  return orderedRealmlists;
};

const setRealmlist$ = async (realmlist) => {
  let currentRealmlist = await readFile$(CONFIG_PATH, true);
  currentRealmlist.content = realmlist.realmlist;
  await writeFile$(CONFIG_PATH, currentRealmlist, true);
  return currentRealmlist;
};

const writeFile$ = async (path, content, toJson = false) => {
  try {
    await fsPromises.writeFile(path, toJson ? JSON.stringify(content, null, 2) : content);
  }
  catch (error) {
    console.error(error);
  }
};

const readFile$ = async (path, toJson = false) => {
  try {
    const content = await fsPromises.readFile(path, { encoding: 'utf8' });
    return toJson ? JSON.parse(content) : content;
  }
  catch (error) {
    console.error(error);
  }
};
