const fs = require('fs');
const path = require('path');
const { ipcMain, BrowserWindow } = require('electron');

const METAMASK_ID = 'nkbihfbeogaeaoehlefnkodbefgpgknn';

const loadMetamask = (session, window) => {
  let manifest;
  let metamaskPopup;
  let metamaskNotification;
  let mainWindow = window;

  fs.readFile(path.join(__dirname,`extensions/metamask/manifest.json`), 'utf8', function (err, data) {
    if (err) throw err;
    manifest = JSON.parse(data);
    manifest.content_scripts[0].include_globs = ['chrome://brave*'];
    // manifest.permissions.push('<all_urls>');
    // manifest.permissions.push('tabs');
    console.log(manifest)
    session.defaultSession.extensions.load(path.join(__dirname,`extensions/metamask`), manifest, 'component');
  });

  ipcMain.on('open-metamask-popup', (event, arg) => {
    console.log(require('electron').screen.getAllDisplays())
    if(metamaskPopup && !metamaskPopup.isDestroyed()) metamaskPopup.close();

    metamaskPopup = new BrowserWindow({
      title: 'MetaMask',
      width: 360,
      height: 520,
      type: 'popup'
      //resizable: false,
    });
    metamaskPopup.loadURL(`chrome-extension://${METAMASK_ID}/popup.html`);
    // fn = '(function(w) {console.log(w);w.type = "popup"})(window)'
    // metamaskPopup.webContents.openDevTools();
    // setTimeout(() => {
    //   metamaskPopup.webContents.executeScriptInTab(METAMASK_ID, fn, {}, (error, on_url, results) => {
    //     console.log(error, on_url, results)
    //   });
    // }, 100);
  });

  ipcMain.on('open-metamask-notification', (event, arg) => {
    if(metamaskNotification && !metamaskNotification.isDestroyed()) metamaskNotification.close();

    metamaskNotification = new BrowserWindow({
      title: 'MetaMask',
      width: 360,
      height: 520,
      type: 'popup'
      //resizable: false,
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
