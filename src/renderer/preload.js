const { remote, ipcRenderer } = require('electron')
const changeTabWithKeyboard = require('./keyboard-change-tab')

const webContents = remote.getCurrentWebContents()
const { session } = webContents

const formatData = data => ({ ...data, url: window.location.href })

const sendData = data => ipcRenderer.sendToHost(formatData(data))

const checkTelegramNotifications = () => {
  const notificationCount = document.querySelectorAll(
    '.im_dialog_badge:not(.ng-hide):not(.im_dialog_badge_muted)',
  ).length

  sendData({
    service: 'telegram',
    eventType: 'chat-notification',
    value: notificationCount,
  })
}

const checkFlowdock = () => {
  const notificationCount = document.querySelectorAll(
    '.activity-indicator-chat',
  ).length

  sendData({
    service: 'flowdock',
    eventType: 'chat-notification',
    value: notificationCount,
  })
}

const checkFb = () => {
  // SOS selectori varmaan muuttuu aina kun facebook päivittää messengeriä
  const notificationCount = document.querySelectorAll('._6zv_').length

  sendData({
    service: 'fb',
    eventType: 'chat-notification',
    value: notificationCount,
  })
}

const checkSlack = service => () => {
  const notificationCount = document.querySelectorAll('.c-mention_badge').length

  sendData({
    service,
    eventType: 'chat-notification',
    value: notificationCount,
  })
}

// All credit to Franz for whatsapp fix
// https://github.com/meetfranz/recipe-whatsapp/blob/master/webview.js
const checkWhatsapp = () => {
  setTimeout(() => {
    if (
      document.querySelector('body').innerHTML.includes('Google Chrome 36+')
    ) {
      window.location.reload()
    }
  }, 1000)

  window.addEventListener('beforeunload', async () => {
    try {
      session.flushStorageData()
      session.clearStorageData({
        storages: [
          'appcache',
          'serviceworkers',
          'cachestorage',
          'websql',
          'indexdb',
        ],
      })

      const registrations = await window.navigator.serviceWorker.getRegistrations()

      registrations.forEach(r => {
        r.unregister()
      })
    } catch (err) {
      console.err(err)
    }
  })
}

ipcRenderer.on('ping-webview', (event, id) => {
  const serviceName = id.replace('service-', '')
  changeTabWithKeyboard(ipcRenderer.sendToHost)

  const notificationChecks = {
    telegram: checkTelegramNotifications,
    flowdock: checkFlowdock,
    fb: checkFb,
    slack: checkSlack(serviceName),
    whatsapp: checkWhatsapp,
  }

  const service =
    notificationChecks[serviceName.includes('slack') ? 'slack' : serviceName]

  service()
  setInterval(service, 1000)
})
