const { app, BrowserWindow, shell, session } = require('electron');
const path = require('path');
const url = require('url');
// const isDev = require('electron-is-dev');
const fs = require('fs');

const extensions = require('./extensions');

// if(isDev) {
//   require('electron-reload')(path.join(__dirname));
// }

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: 'assets/swapy3.png',
  });

  extensions.loadMetamask(session, win);

  // win.webContents.executeJavaScript("window.isElectron=true;")

  win.loadURL(url.format({
    pathname: path.join(`brave/${__dirname}`, 'index.html'),
    protocol: 'chrome',
    slashes: true
  }));

  //if(isDev) {
    // Open the DevTools.
    win.webContents.openDevTools();
  //}

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
