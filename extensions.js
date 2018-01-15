const fs = require('fs');
const path = require('path');
const { ipcMain, BrowserWindow } = require('electron');

const METAMASK_ID = 'nkbihfbeogaeaoehlefnkodbefgpgknn';

const getMetamaskPath = (isDev) => {
  if (isDev) {
    return path.join(__dirname,`extensions/metamask/`);
  }
  return path.resolve(__dirname,`../../app.asar.unpacked/dist/extensions/metamask/`);
};

const loadMetamask = (session, window, isDev) => {
  let manifest;
  let metamaskPopup;
  let metamaskNotification;
  let mainWindow = window;
  const metamaskPath = getMetamaskPath(isDev);

  fs.readFile(`${metamaskPath}/manifest.json`, 'utf8', function (err, data) {
    if (err) throw err;
    manifest = JSON.parse(data);
    session.defaultSession.extensions.load(metamaskPath, manifest, 'component');
  });

  ipcMain.on('open-metamask-popup', (event, arg) => {
    if(metamaskPopup && !metamaskPopup.isDestroyed()) metamaskPopup.close();

    metamaskPopup = new BrowserWindow({
      title: 'MetaMask',
      width: 360,
      height: 520,
      type: 'popup',
      resizable: false
    });
    metamaskPopup.loadURL(`chrome-extension://${METAMASK_ID}/popup.html`);
  });

  ipcMain.on('open-metamask-notification', (event, arg) => {
    if(metamaskNotification && !metamaskNotification.isDestroyed()) metamaskNotification.close();

    metamaskNotification = new BrowserWindow({
      title: 'MetaMask',
      width: 360,
      height: 520,
      type: 'popup',
      resizable: false
    });
    metamaskNotification.loadURL(`chrome-extension://${METAMASK_ID}/notification.html`);
  });

  ipcMain.on('close-metamask-notification', (event, arg) => {
    metamaskNotification.close();
  });
};

module.exports = {
  loadMetamask
};
