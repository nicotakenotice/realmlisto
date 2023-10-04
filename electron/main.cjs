const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const path = require('node:path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const { spawn } = require('node:child_process');

const DATA_PATH = path.join(__dirname, '..', 'data');
const CONFIG_PATH = path.join(DATA_PATH, 'config.json');
const REALMLISTS_PATH = path.join(DATA_PATH, 'realmlists.json');

let config = null;

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
      fs.writeFileSync(CONFIG_PATH, JSON.stringify({ path: '' }, null, 2));
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
  ipcMain.handle('startClient$', (e, realmlistPath) => startClient$(realmlistPath));
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

/* ========================================================================= */

const startClient$ = async (realmlistPath) => {
  const execPath = path.join(realmlistPath, '../../..', 'wow.exe');
  if (fs.existsSync(execPath)) {
    const client = spawn(execPath, { detached: true, stdio: 'ignore' });
    client.unref();
    return true;
  }
  return false;
};

const getRealmlist$ = async (source) => {
  let realmlistPath = '';
  let realmlistContent = '';

  if (source === 'config') {
    if (!config) {
      // Load config
      config = await readFile$(CONFIG_PATH, true);
    }
    if (config.path) {
      realmlistPath = config.path;
    }
  }
  else {
    const { canceled, filePaths } = await dialog.showOpenDialog({ filters: [{ name: 'Realmlist', extensions: ['wtf'] }] });
    if (!canceled) {
      realmlistPath = filePaths[0];
    }
  }
  if (realmlistPath) {
    realmlistContent = await readFile$(realmlistPath);
    // Cache realmlist
    config.path = realmlistPath;
    await writeFile$(CONFIG_PATH, config, true);
  }
  return { path: realmlistPath, content: realmlistContent.trim() };
};

const getRealmlists$ = async () => {
  const realmlists = await readFile$(REALMLISTS_PATH, true);
  const sortedRealmlists = sortRealmlistsByServerName(realmlists);
  return sortedRealmlists;
};

const saveRealmlists$ = async (realmlists) => {
  const sortedRealmlists = sortRealmlistsByServerName(realmlists);
  await writeFile$(REALMLISTS_PATH, sortedRealmlists, true);
  return sortedRealmlists;
};

const setRealmlist$ = async (realmlist) => {
  if (config.path) {
    await writeFile$(config.path, realmlist.realmlist);
    const realmlistFile = await getRealmlist$('config');
    return realmlistFile;
  }
  throw new Error('No realmlist path specified');
};

const sortRealmlistsByServerName = (realmlists) => {
  return structuredClone(realmlists).sort((a, b) => {
    const aServer = a.server.toLowerCase();
    const bServer = b.server.toLowerCase();
    if (aServer < bServer) return -1;
    if (aServer > bServer) return 1;
    return 0;
  });
};
