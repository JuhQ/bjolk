const services = require('./services')
const { negate, filterDuplicates } = require('./utils')

const getLocalstorage = (key, fallback) =>
  JSON.parse(window.localStorage.getItem(key)) || fallback

const setLocalstorage = (key, value) =>
  window.localStorage.setItem(key, JSON.stringify(value))

const appendUnique = ({ key, value, fn }) =>
  setLocalstorage(key, filterDuplicates([...fn(), value]))

const removeFromList = ({ key, listfn, value }) =>
  setLocalstorage(key, listfn().filter(negate((name) => name === value)))

const getActiveChat = () => getLocalstorage('active-chat', services[0].name)
const setActiveChat = (service) => setLocalstorage('active-chat', service)
const resetActiveChat = () => setLocalstorage('active-chat', services[0].name)

const resetLocalStorage = () => window.localStorage.clear()

module.exports = {
  helpers: { appendUnique, removeFromList },
  getActiveChat,
  setActiveChat,
  resetActiveChat,
  getLocalstorage,
  setLocalstorage,
  resetLocalStorage,
}
