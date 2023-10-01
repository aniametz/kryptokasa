const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let server;

async function createWindow() {
  const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })
    
    mainWindow.loadURL('http://localhost:3000');
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
}

app.on('ready', () => {
    createWindow()
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
});