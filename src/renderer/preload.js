const { ipcRenderer } = require('electron')

const changeTabWithKeyboard = require('./keyboard-change-tab')
const checkFb = require('./preloaders/facebook')
const checkFlowdock = require('./preloaders/flowdock')
const checkSlack = require('./preloaders/slack')
const checkMattermost = require('./preloaders/mattermost')
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
    mattermost: checkMattermost(serviceName),
    whatsapp: checkWhatsapp,
  }

  const isSlack = serviceName.includes('slack')
  const isMattermost = serviceName.includes('mattermost')

  const maybemattermost = isMattermost ? 'mattermost' : serviceName
  const customServiceName = isSlack ? 'slack' : maybemattermost

  const service = notificationChecks[customServiceName]

  service()
  setInterval(service, 1000)
})
