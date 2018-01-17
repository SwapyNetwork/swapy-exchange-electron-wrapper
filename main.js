const { app, BrowserWindow, shell, session } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

const extensions = require('./extensions');

let isDev;
try {
  isDev = require('electron-is-dev');
} catch(e) {
  isDev = false;
}

if(isDev) {
  require('electron-reload')(path.join(__dirname));
}

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080
  });

  extensions.loadMetamask(session, win, isDev);

  let indexPath;
  isDev ? indexPath = path.join(`brave/${__dirname}`, 'app/dist/index.html') : indexPath = path.join(`brave/${__dirname}`, 'index.html');

  setTimeout(() => {
    win.loadURL(url.format({
      pathname: indexPath,
      protocol: 'chrome',
      slashes: true
    }));
    win.maximize();
  }, 200);

  if(isDev) {
    win.webContents.openDevTools();
  }

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
