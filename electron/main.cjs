const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const path = require('node:path');
const fs = require('fs/promises');

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
}

app.whenReady().then(() => {
  ipcMain.handle('getRealmlist$', getRealmlist$);

  createWindow();

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
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    const realmlistPath = filePaths[0];
    if (realmlistPath.endsWith('.wtf')) {
      const realmlistContent = await fs.readFile(realmlistPath, { encoding: 'utf8' });
      return { path: realmlistPath, content: realmlistContent.trim() };  
    }
  }
  return { path: '', content: '' };
};
