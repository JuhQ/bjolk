const { ipcRenderer } = require('electron')

const { getButtons } = require('./utils')

const add = (a, b) => a + b

const readAndSendNotificationCount = () => {
  setInterval(() => {
    const notificationCount = [...getButtons()]
      .map(({ count }) => count)
      .filter(Boolean)
      .reduce(add, 0)

    ipcRenderer.send('notification-count', notificationCount)
  }, 1500)
}

module.exports = { readAndSendNotificationCount }
