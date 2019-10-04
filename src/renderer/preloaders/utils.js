const { ipcRenderer } = require('electron')

const formatData = data => ({ ...data, url: window.location.href })

const sendData = data => ipcRenderer.sendToHost(formatData(data))

const sendNotification = data =>
  sendData({ ...data, eventType: 'chat-notification' })

module.exports = { sendNotification }
