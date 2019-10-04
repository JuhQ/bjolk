const {
  resetLocalStorage,
  addSlackChannel,
  addVisibleService,
  removeVisibleService,
  getSlackChannels,
  getActiveChat,
  getServices,
  resetActiveChat,
  setDoNotDisturb,
  removeSlackChannel,
  getVisibleServices,
} = require('./localstorage')
const { createSideBar, clearSideBarEventListeners } = require('./sidebar')
const { addWebview } = require('./webviews')
const { getSlackUrl, setHtml } = require('./utils')

const handleResetLocalstorageButton = () =>
  document
    .querySelector('#reset-localstorage')
    .addEventListener('click', resetLocalStorage)

const printList = () => {
  const container = document.getElementById('slack-list')

  const html = getSlackChannels()
    .map(
      channel =>
        `
        <div class="slack-service-list">
          <p>${channel}</p>
          <button class="bjolk-button bjolk-delete-button delete-slack" name="${channel}">Delete</button>
        </div>`,
    )
    .join('')

  setHtml(container, html)
}

const deleteSlackListener = element => ({ target }) => {
  const channel = target.getAttribute('name')

  removeSlackChannel(channel)

  clearSideBarEventListeners()

  // does not remove event listeners hooked to the webview
  document.getElementById(`service-${channel}-slack`).remove()

  element.removeEventListener('click', deleteSlackListener)

  if (getActiveChat() === channel) {
    resetActiveChat()
  }

  // eslint-disable-next-line
  listSlackChannels()
  createSideBar()
}

const listSlackChannels = () => {
  printList()

  document
    .querySelectorAll('.delete-slack')
    .forEach(element =>
      element.addEventListener('click', deleteSlackListener(element)),
    )
}

const handleSlackChannelCreation = () => {
  document.querySelector('#add-slack').addEventListener('submit', event => {
    event.preventDefault()

    const input = document.getElementById('slack-channel-name')
    const name = input.value

    addSlackChannel(name)

    createSideBar()
    addWebview({ name, url: getSlackUrl(name) })

    input.value = ''

    listSlackChannels()
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
  document.querySelectorAll('.show-service').forEach(element =>
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
  handleChatVisibility()
  listSlackChannels()
  handleServiceShowing()
  handleDoNotDisturb()
}

module.exports = { settingsPageInit }
