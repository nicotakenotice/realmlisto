const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  app.isPackaged
    ? mainWindow.loadFile('../src/app.html')
    : mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) 
      createWindow();
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') 
    app.quit();
});
