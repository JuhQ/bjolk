const { sendNotification } = require('./utils')

const checkFlowdock = () => {
  const value = document.querySelectorAll('.activity-indicator-chat').length

  sendNotification({ service: 'flowdock', value })
}

module.exports = checkFlowdock
