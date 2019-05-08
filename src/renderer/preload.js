const { ipcRenderer } = require('electron')

const changeTabWithKeyboard = require('./keyboard-change-tab')

const formatData = data => ({ ...data, url: window.location.href })

const checkTelegramNotifications = () => {
  const notificationCount = document.querySelectorAll(
    '.im_dialog_badge:not(.ng-hide):not(.im_dialog_badge_muted)',
  ).length

  ipcRenderer.sendToHost(
    formatData({
      service: 'telegram',
      eventType: 'chat-notification',
      value: notificationCount,
    }),
  )
}

const checkFlowdock = () => {
  const notificationCount = document.querySelectorAll(
    '.activity-indicator-chat',
  ).length

  ipcRenderer.sendToHost(
    formatData({
      service: 'flowdock',
      eventType: 'chat-notification',
      value: notificationCount,
    }),
  )
}

const checkFb = () => {
  // SOS selectori varmaan muuttuu aina kun facebook päivittää messengeriä
  const notificationCount = document.querySelectorAll('._6zv_').length

  ipcRenderer.sendToHost(
    formatData({
      service: 'fb',
      eventType: 'chat-notification',
      value: notificationCount,
    }),
  )
}

const checkSlack = service => () => {
  const notificationCount = document.querySelectorAll('.c-mention_badge').length

  ipcRenderer.sendToHost(
    formatData({
      service,
      eventType: 'chat-notification',
      value: notificationCount,
    }),
  )
}

ipcRenderer.on('ping-webview', (event, id) => {
  const serviceName = id.replace('service-', '')
  changeTabWithKeyboard(ipcRenderer.sendToHost)

  const notificationChecks = {
    telegram: checkTelegramNotifications,
    flowdock: checkFlowdock,
    fb: checkFb,
    slack: checkSlack(serviceName),
  }

  const service =
    notificationChecks[serviceName.includes('slack') ? 'slack' : serviceName]

  service()
  setInterval(service, 1500)
})
