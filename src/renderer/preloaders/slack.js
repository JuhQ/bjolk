const { sendNotification } = require('./utils')

const checkSlack = (service) => () => {
  const value = document.querySelectorAll('.c-mention_badge').length

  sendNotification({ service, value })
}

module.exports = checkSlack
