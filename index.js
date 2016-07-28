'use strict';
const electron = require('electron');
const app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var client = require('electron-connect').client;

var nosql = require('nosql').load("/database.nosql");
if (!nosql.isReady) {
    nosql.created;
}

app.on('ready', function () {
  let mainWindow = new electron.BrowserWindow({width: 1235, height: 670})
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Connect to server process
  mainWindow.webContents.openDevTools()
	mainWindow.maximize();
  
  mainWindow.on('closed', function () {
    mainWindow = null
  });
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});