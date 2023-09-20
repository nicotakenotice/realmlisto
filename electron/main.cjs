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
      fs.writeFileSync(CONFIG_PATH, '');
    }
    if (!fs.existsSync(REALMLISTS_PATH)) {
      fs.writeFileSync(REALMLISTS_PATH, '');
    }
  }
  catch (error) {
    console.error(error);
  }
};

app.whenReady().then(() => {
  ipcMain.handle('getRealmlist$', getRealmlist$);

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

const getRealmlist$ = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({ filters: [{ name: 'Realmlist', extensions: ['wtf'] }] });
  if (!canceled) {
    const realmlistPath = filePaths[0];
    const realmlistContent = await fsPromises.readFile(realmlistPath, { encoding: 'utf8' });
    return { path: realmlistPath, content: realmlistContent.trim() };  
  }
  return { path: '', content: '' };
};
