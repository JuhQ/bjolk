const { sendNotification } = require('./utils')

const checkFlowdock = () => {
  const value = document.querySelectorAll('.activity-indicator-mentions').length

  sendNotification({ service: 'flowdock', value })
}

module.exports = checkFlowdock
