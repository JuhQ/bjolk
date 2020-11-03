/* eslint-disable no-use-before-define */
const {
  resetLocalStorage,
  getActiveChat,
  resetActiveChat,
} = require('./localstorage')
const {
  addSlackChannel,
  addMattermostChannel,
  getSlackChannels,
  getMattermostChannels,
  removeSlackChannel,
  removeMattermostChannel,
} = require('./components/custom-chats')
const {
  getServices,
  addVisibleService,
  removeVisibleService,
  getVisibleServices,
} = require('./components/services')
const { setDoNotDisturb } = require('./components/do-not-disturb')
const { createSideBar, clearSideBarEventListeners } = require('./sidebar')
const { addWebview, createChatViews } = require('./webviews')
const { getSlackUrl, setHtml } = require('./utils')

const handleResetLocalstorageButton = () =>
  document
    .querySelector('#reset-localstorage')
    .addEventListener('click', resetLocalStorage)

const printCustomChat = ({ service, fn }) => {
  const container = document.getElementById(`${service}-list`)

  const html = fn()
    .map(
      (channel) => `
        <div class="${service}-service-list">
          <p>${channel}</p>
          <button class="bjolk-button bjolk-delete-button delete-${service}" name="${channel}">Delete</button>
        </div>`,
    )
    .join('')

  setHtml(container, html)
}

const printSlackList = () => {
  printCustomChat({ service: 'slack', fn: getSlackChannels })
}

const printMattermostList = () => {
  printCustomChat({ service: 'mattermost', fn: getMattermostChannels })
}

const deleteCustomChatListener = ({ service, channel, rmFn, listFn }) => {
  rmFn(channel)

  clearSideBarEventListeners()

  // does not remove event listeners hooked to the webview
  document.getElementById(`service-${channel}-${service}`).remove()

  if (getActiveChat() === channel) {
    resetActiveChat()
  }

  listFn()
  createSideBar()
}

const deleteSlackListener = (element) => ({ target }) => {
  deleteCustomChatListener({
    service: 'slack',
    channel: target.getAttribute('name'),
    rmFn: removeSlackChannel,
    listFn: listSlackChannels,
  })

  element.removeEventListener('click', deleteSlackListener)
}

const deleteMattermostListener = (element) => ({ target }) => {
  deleteCustomChatListener({
    service: 'mattermost',
    channel: target.getAttribute('name'),
    rmFn: removeMattermostChannel,
    listFn: listMattermostChannels,
  })

  element.removeEventListener('click', deleteMattermostListener)
}

const listCustomChatChannels = ({ service, printListFn, deleteListener }) => {
  printListFn()

  document
    .querySelectorAll(`.delete-${service}`)
    .forEach((element) =>
      element.addEventListener('click', deleteListener(element)),
    )
}

const listSlackChannels = () => {
  listCustomChatChannels({
    service: 'slack',
    printListFn: printSlackList,
    deleteListener: deleteSlackListener,
  })
}

const listMattermostChannels = () => {
  listCustomChatChannels({
    service: 'mattermost',
    printListFn: printMattermostList,
    deleteListener: deleteMattermostListener,
  })
}

const handleSlackChannelCreation = () => {
  document.querySelector('#add-slack').addEventListener('submit', (event) => {
    event.preventDefault()

    const input = document.getElementById('slack-channel-name')
    const name = input.value.trim()

    addSlackChannel(name)

    createSideBar()
    addWebview({ name, url: getSlackUrl(name), service: 'slack' })

    input.value = ''

    listSlackChannels()
  })
}

const handleMattermostChannelCreation = () => {
  document
    .querySelector('#add-mattermost')
    .addEventListener('submit', (event) => {
      event.preventDefault()

      const input = document.getElementById('mattermost-channel-name')
      const url = input.value.replace('https://https://', 'https://').trim()

      addMattermostChannel(url)

      createSideBar()
      addWebview({ name: url, url, service: 'mattermost' })

      input.value = ''

      listMattermostChannels()
    })
}

const handleChatVisibility = () => {
  const container = document.getElementById('service-list')
  const visibleServices = getVisibleServices()
  const html = getServices()
    .map(
      ({ name }) =>
        `<div class="settings-service">
          <p>${name}</p>
          <label class="switch">
            <input type="checkbox" ${
              visibleServices.includes(name) ? 'checked' : ''
            } name="${name}" class="show-service">
            <span class="slider round"></span>
          </label>
        </div>`,
    )
    .join('')

  setHtml(container, html)
}

const handleServiceShowing = () => {
  document.querySelectorAll('.show-service').forEach((element) =>
    element.addEventListener('click', ({ target }) => {
      const name = target.getAttribute('name')
      if (target.checked === false) {
        if (getActiveChat() === name) {
          resetActiveChat()
        }
        removeVisibleService(name)
      } else {
        addVisibleService(name)
      }

      createSideBar()
      createChatViews()
    }),
  )
}

const handleDoNotDisturb = () => {
  document.querySelector('#do-not-disturb').addEventListener('click', () => {
    setDoNotDisturb()
    // eslint-disable-next-line
    alert('Notifications disabled for 8 hours')
  })
}

const settingsPageInit = () => {
  handleResetLocalstorageButton()
  handleSlackChannelCreation()
  handleMattermostChannelCreation()
  handleChatVisibility()
  listSlackChannels()
  listMattermostChannels()
  handleServiceShowing()
  handleDoNotDisturb()
}

module.exports = { settingsPageInit }
