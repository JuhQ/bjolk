const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 700,
    frame: false,
    icon: path.join(__dirname, 'assets/icons/icon-128.png.icns'),
    webPreferences: {
      nodeIntegration: true,
      // contextIsolation: false,
    },
  })

  // for whatsapp?
  // session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
  //   details.requestHeaders["User-Agent"] =
  //     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.128";
  //   callback({ cancel: false, requestHeaders: details.requestHeaders });
  // });

  mainWindow.loadFile('./src/main/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  ipcMain.on('notification-count', (event, count) => {
    app.dock.setBadge(count ? `${count}` : '')
  })
}

app.setName('Bjolk')

// open links in default browser
app.on('web-contents-created', (_, contents) => {
  if (contents.getType() === 'webview') {
    contents.on('new-window', (event, url) => {
      event.preventDefault()
      shell.openExternal(url)
    })
  }
})

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
