const { app, BrowserWindow, autoUpdater, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

require('update-electron-app')()
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

ipcMain.on('always-on-top', (event, arg) => {
  win.setAlwaysOnTop(arg)
})

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    resizable: false,
    transparent: true,
    center: true,
    width: 300,
    height: 38,
    frame: false,
    title: 'Tomeito',
    acceptFirstMouse: true,
    minimizable: true,
    maximizable: false,
    hasShadow: false
  })

  // and load the index.html of the app.
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  // win.setPosition(win.getPosition()[0], 40, false)
  win.center()
  // Open the DevTools.
  //  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
