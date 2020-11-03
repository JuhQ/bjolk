const { helpers, getLocalstorage } = require('../localstorage')

const { appendUnique, removeFromList } = helpers

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

module.exports = {
  getSlackChannels,
  getMattermostChannels,
  addSlackChannel,
  addMattermostChannel,
  removeSlackChannel,
  removeMattermostChannel,
}
