const path = require('path').resolve('.')
import { app, BrowserWindow, Menu } from 'electron'
// const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');
import config from '../../static/js/config'
const {spawn} = require('child_process')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  // Menu.setApplicationMenu(null)
  if (process.platform === 'darwin') {
    const template = [
      {
        label: "Application",
        submenu: [
          { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]
      }, 
      {
        label: "Edit",
        submenu: [
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        ]
      }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  } else {
    Menu.setApplicationMenu(null)
  }
  /**
   * Initial window options
   */
  // BrowserWindow.addDevToolsExtension('~/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/3.1.6_0');
  // console.log(process)
  mainWindow = new BrowserWindow({
    height: 1341,
    width: 1200,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })
  mainWindow.loadURL(winURL)
  // mainWindow.openDevTools()
  mainWindow.on('closed', () => {
    try {
      mainWindow.close()
      mainWindow = null
    } catch (error) {
      console.log(error)
    }
    // cookies.clearCookies()
    // Cookies.set(config.cookies.token, '', { expires: 0 })
    // Cookies.set(config.cookies.address, '', { expires: 0 })
    // Cookies.set(config.cookies.safeMode, '', { expires: 0 })
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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

 /**
 * @description 打开其他应用程序
 */
try {
  // console.log(config)
  // spawn(config.gDcrm)
} catch (error) {
  console.error(error)
}