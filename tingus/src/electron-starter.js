// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const url = require('url');
const path = require('path');
const updater = require('./updater');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

if (!process.env.ELECTRON_START_URL) {
  const createTingusBackendProc = () => {
    console.log('Creating Tingus Backend Proc...');
    currentDir = path.join(__dirname, '../../');
    pathTingus = path.join(currentDir, 'Tingus-Backend', 'Tingus-Backend.exe');
    console.log('Path to Backend: ', pathTingus);
    tingusBackendProc = spawn(pathTingus);

    tingusBackendProc.stdout.on('data', data => {
      console.log('stdout: ' + data.toString());
    });

    tingusBackendProc.stderr.on('data', data => {
      console.log('stderr: ' + data.toString());
    });

    tingusBackendProc.on('data', code => {
      console.log('child process exited with code ' + code.toString());
    });
  };

  const exitTingusBackendProc = () => {
    tingusBackendProc.kill();
    tingusBackendProc = null;
  };

  app.on('ready', createTingusBackendProc);

  app.on('will-quit', exitTingusBackendProc);
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1366,
    minHeight: 768
  });

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true
    });

  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // Create Window
  createWindow();
  if (!process.env.ELECTRON_START_URL) {
    // Check for update after x seconds
    setTimeout(updater.check, 2000);
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
