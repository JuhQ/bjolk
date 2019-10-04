const { sendNotification } = require('./utils')

const selector = '.im_dialog_badge:not(.ng-hide):not(.im_dialog_badge_muted)'

const checkTelegramNotifications = () => {
  const value = document.querySelectorAll(selector).length

  sendNotification({ service: 'telegram', value })
}

module.exports = checkTelegramNotifications
