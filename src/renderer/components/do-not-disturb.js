const { setLocalstorage, getLocalstorage } = require('../localstorage')

const eightHours = 3600 * 8 * 1000
const setDoNotDisturb = () =>
  setLocalstorage('do-not-disturb', +new Date() + eightHours)

const getDoNotDisturb = () => {
  const timestamp = getLocalstorage('do-not-disturb')
  return timestamp && timestamp > +new Date()
}

module.exports = {
  setDoNotDisturb,
  getDoNotDisturb,
}
