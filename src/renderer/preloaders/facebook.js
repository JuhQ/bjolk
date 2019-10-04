const { sendNotification } = require('./utils')

const checkFb = () => {
  // SOS selectori varmaan muuttuu aina kun facebook päivittää messengeriä
  const value = document.querySelectorAll('._6zv_').length

  sendNotification({ service: 'fb', value })
}

module.exports = checkFb
