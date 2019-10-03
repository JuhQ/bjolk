const {
  getServices,
  getActiveChat,
  getVisibleServices,
} = require('./localstorage')
const {
  getButtons,
  setHtml,
  addClass,
  removeClass,
  favicon,
} = require('./utils')
const { setActiveChatScreen } = require('./webviews')

const activateCurrentChat = () => {
  const currentActiveChat = getActiveChat()

  addClass(`#button-${currentActiveChat}`, 'active')
}

const activateChatScreen = ({ currentTarget }) => {
  const name = currentTarget.getAttribute('name')
  setActiveChatScreen(name)
}

const createSideBar = () => {
  const sidebar = document.querySelector('.sidebar .chats')
  const visibleServices = getVisibleServices()

  const list = getServices().filter(({ name }) =>
    visibleServices.includes(name),
  )

  if (list.length) {
    const html = list
      .map(
        ({ name, url }) =>
          `<button id="button-${name}" name="${name}">
            <img src="${favicon(url)}" class="chat-icon">
            <br/>
            ${name}
          </button>`,
      )
      .join('')

    setHtml(sidebar, html)

    getButtons().forEach(button => {
      button.addEventListener('click', activateChatScreen)
    })
  } else {
    setHtml(sidebar, 'Check settings')
  }
}

const clearSideBarEventListeners = () => {
  getButtons().forEach(button => {
    button.removeEventListener('click', activateChatScreen)
  })
}

const settingsButtonListener = () => {
  document
    .querySelector('.sidebar .tools .settings-button')
    .addEventListener('click', () => {
      removeClass('.chat-window.active', 'active')
      addClass('#settings.chat-window', 'active')
    })
}

const initSidebar = () => {
  createSideBar()
  activateCurrentChat()
  settingsButtonListener()
}

module.exports = { initSidebar, createSideBar, clearSideBarEventListeners }
