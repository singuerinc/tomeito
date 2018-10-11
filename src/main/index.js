import { app, BrowserWindow, ipcMain } from 'electron'

if (process.env.NODE_ENV === 'production') {
  require('update-electron-app')({
    repo: 'singuerinc/tomeito',
    logger: require('electron-log')
  })
}

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    resizable: false,
    transparent: true,
    center: true,
    width: 300,
    height: 30,
    frame: false,
    title: 'Tomeito',
    acceptFirstMouse: true,
    minimizable: true,
    maximizable: false,
    hasShadow: true,
    backgroundColor: '#00000000'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('always-on-top', (event, arg) => {
  mainWindow.setAlwaysOnTop(arg)
})
