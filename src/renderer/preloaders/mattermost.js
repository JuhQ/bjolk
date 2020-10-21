const { sendNotification } = require('./utils')

const checkMattermost = (service) => () => {
  const titleNotification = document.title.match(/\([0-9+]\)/)

  const value = titleNotification
    ? Number(titleNotification[0].replace(/\(|\)/g, ''))
    : 0

  sendNotification({ service, value })
}

module.exports = checkMattermost
