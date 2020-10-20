const services = require('./services')
const { negate, filterDuplicates, getSlackUrl } = require('./utils')

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

const defaultVisibleChats = ['telegram', 'fb']
const getVisibleServices = () =>
  getLocalstorage('visible-services', defaultVisibleChats)

const addVisibleService = (service) =>
  appendUnique({
    key: 'visible-services',
    value: service,
    fn: getVisibleServices,
  })

const removeVisibleService = (service) =>
  removeFromList({
    key: 'visible-services',
    listfn: getVisibleServices,
    value: service,
  })

const getChannelsFor = (name) => getLocalstorage(`${name}-channels`, [])

const getSlackChannels = () => getChannelsFor('slack')
const getMattermostChannels = () => getChannelsFor('mattermost')

const addSlackChannel = (channel) =>
  appendUnique({
    key: 'slack-channels',
    value: channel,
    fn: getSlackChannels,
  })

const addMattermostChannel = (channel) =>
  appendUnique({
    key: 'mattermost-channels',
    value: channel,
    fn: getMattermostChannels,
  })

const removeSlackChannel = (channel) =>
  removeFromList({
    key: 'slack-channels',
    listfn: getSlackChannels,
    value: channel,
  })

const removeMattermostChannel = (channel) =>
  removeFromList({
    key: 'mattermost-channels',
    listfn: getMattermostChannels,
    value: channel,
  })

const resetLocalStorage = () => window.localStorage.clear()

const getServices = () => [
  ...services,
  ...getSlackChannels().map((name) => ({
    name: `${name}-slack`,
    url: getSlackUrl(name),
  })),
  ...getMattermostChannels().map((url) => ({
    name: `${url
      .replace(/\//g, '')
      .replace('https', '')
      .replace(/(:|\.)/g, '-')
      .replace('-', '')}-mattermost`,
    url,
  })),
]

const eightHours = 3600 * 8 * 1000
const setDoNotDisturb = () =>
  setLocalstorage('do-not-disturb', +new Date() + eightHours)

const getDoNotDisturb = () => {
  const timestamp = getLocalstorage('do-not-disturb')
  return timestamp && timestamp > +new Date()
}

module.exports = {
  getServices,
  getActiveChat,
  setActiveChat,
  resetActiveChat,
  getSlackChannels,
  getMattermostChannels,
  addSlackChannel,
  addMattermostChannel,
  removeSlackChannel,
  removeMattermostChannel,
  resetLocalStorage,
  getVisibleServices,
  addVisibleService,
  removeVisibleService,
  setDoNotDisturb,
  getDoNotDisturb,
}
