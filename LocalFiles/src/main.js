const { app, BrowserWindow, dialog } =  require('electron');
const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let filename;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    width: 800,
    height: 425,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/render/index.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

/* IPC */
// SelectFile
ipcMain.on('select_file_main', (event) => {
  console.log("Seleccion del archivo");

  // Set default filename
  filename =__dirname+'/note.txt';


  // dialog.showOpenDialog
  // dialog.showOpenDialogSync

  dialog.showOpenDialog({
    filters: [{ name: 'Texto', extensions: ['txt'] }]
  }).then( (result) => {
    filename = result.filePaths[0]
    if (! result.canceled ) {
      console.log(filename);
      event.sender.send('filename_show', filename);
      console.log();

      fs.readFile(filename, (err, data) => {
        if (err) throw err;
        event.sender.send('file_name_render', data);
      });
    }
  }).catch( err => console.log(err))




});

ipcMain.on('save_file', (event, data) => {
  fs.writeFile(filename, data, (err) => {
    if (err) throw err;
    // console.log(data)
    // Disparo la funcion "file_saved" en el render
    event.sender.send('file_saved')
  })

});
