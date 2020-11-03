const services = require('../services')
const { helpers, getLocalstorage } = require('../localstorage')

const { getSlackUrl } = require('../utils')
const { getSlackChannels, getMattermostChannels } = require('./custom-chats')

const { appendUnique, removeFromList } = helpers

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

module.exports = {
  getServices,
  getVisibleServices,
  addVisibleService,
  removeVisibleService,
}
