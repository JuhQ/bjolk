const { sendNotification } = require('./utils')

const checkMattermost = () => {
  const value = document.querySelectorAll('.activity-indicator-mentions').length

  sendNotification({ service: 'mattermost', value })
}

module.exports = checkMattermost
