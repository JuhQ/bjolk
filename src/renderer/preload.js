const { ipcRenderer } = require('electron')

const changeTabWithKeyboard = require('./keyboard-change-tab')
const checkFb = require('./preloaders/facebook')
const checkFlowdock = require('./preloaders/flowdock')
const checkSlack = require('./preloaders/slack')
const checkTelegramNotifications = require('./preloaders/telegram')
const checkWhatsapp = require('./preloaders/whatsapp')

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
