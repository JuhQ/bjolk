const { ipcRenderer } = require('electron')

const { getButtons } = require('./utils')

const readAndSendNotificationCount = () => {
  setInterval(() => {
    const notificationCount = [...getButtons()]
      .map(({ count }) => count)
      .filter(Boolean)
      .reduce((a, b) => a + b, 0)

    ipcRenderer.send('notification-count', notificationCount)
  }, 1500)
}

module.exports = { readAndSendNotificationCount }
