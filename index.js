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
  let mainWindow = new BrowserWindow({width: 1235, height: 670})
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Connect to server process
  client.create(mainWindow);
  mainWindow.webContents.openDevTools()
	mainWindow.maximize();
  
  mainWindow.on('closed', function () {
    mainWindow = null
  });
});