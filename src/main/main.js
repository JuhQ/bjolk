const { app, BrowserWindow, ipcMain, shell, session } = require('electron')
const path = require('path')

const createMenu = require('./menu')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const browserWindowConfig = {
  width: 1080,
  height: 700,
  frame: false,
  icon: path.join(__dirname, 'assets/icons/icon-512.icns'),
  webPreferences: {
    webviewTag: true,
    nodeIntegration: true,
    // contextIsolation: false,
  },
}

const whatsappHack = () => {
  // for whatsapp?
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    // eslint-disable-next-line
    details.requestHeaders['User-Agent'] =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'
    callback({ cancel: false, requestHeaders: details.requestHeaders })
  })
}

const createWindow = () => {
  mainWindow = new BrowserWindow(browserWindowConfig)

  whatsappHack()

  mainWindow.loadFile('./src/main/index.html')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  if (process.platform === 'darwin') {
    ipcMain.on('notification-count', (event, count) => {
      app.dock.setBadge(count ? `${count}` : '')
    })
  }

  createMenu(mainWindow)
}

app.setName('Bjolk')

let previousUrl = null

const onWebContentsCreated = (_, contents) => {
  if (contents.getType() === 'webview') {
    contents.on('new-window', (event, url) => {
      if (url !== previousUrl) {
        event.preventDefault()
        shell.openExternal(url)
      }

      // hack for flowdock
      previousUrl = url
      setTimeout(() => {
        previousUrl = null
      }, 1000)
    })
  }
}

// open links in default browser
app.on('web-contents-created', onWebContentsCreated)

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
