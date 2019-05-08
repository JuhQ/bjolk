const { getServices, getActiveChat, setActiveChat } = require('./localstorage')
const {
  setHtml,
  appendHtml,
  removeClass,
  addClass,
  getButtons,
  favicon,
} = require('./utils')

const services = getServices()

const setActiveChatScreen = name => {
  removeClass('.chat-window.active', 'active')
  addClass(`#service-${name}.chat-window`, 'active')

  removeClass('.sidebar .chats button.active', 'active')
  addClass(`#button-${name}`, 'active')

  setActiveChat(name)
}

const setActiveWindowFromKeyDown = index => {
  const button = getButtons()[index]
  if (button) {
    setActiveChatScreen(button.getAttribute('name'))
  }
}

const activateCurrentChat = () => {
  const currentActiveChat = getActiveChat()

  removeClass('.chat-window.active', 'active')
  addClass(`.chat-window#service-${currentActiveChat}`, 'active')
}

const setChatButtonNotificationCount = ({ service, url, value }) => {
  const button = document.querySelector(`button#button-${service}`)
  if (button) {
    button.count = value
    const faviconImage = `<img src="${favicon(url)}">`
    if (value) {
      setHtml(button, `${faviconImage} ${service} (${value})`)
    } else {
      setHtml(button, `${faviconImage} ${service}`)
    }
  }
}

const listenToSingleWebview = webview => {
  webview.addEventListener('dom-ready', () => {
    webview.addEventListener('ipc-message', event => {
      if (event.channel.eventType === 'keydown') {
        setActiveWindowFromKeyDown(event.channel.value)
      }

      if (event.channel.eventType === 'chat-notification') {
        setChatButtonNotificationCount(event.channel)
      }
    })

    webview.send('ping-webview', webview.id)
  })
}

const listenToWebviews = () => {
  document
    .querySelectorAll('.chat-container webview')
    .forEach(listenToSingleWebview)
}

const webviewHtml = ({ name, url }) => `<webview
    src="${url}"
    preload="../renderer/preload.js"
    id="service-${name}"
    class="chat-window">
  </webview>`

const getChatContainer = () => document.querySelector('.chat-container')

const createWebViews = () => {
  const container = getChatContainer()

  services.forEach(({ name, url }) => {
    appendHtml(container, webviewHtml({ name, url }))
  })

  activateCurrentChat()
  listenToWebviews()
}

const addWebview = ({ name, url }) => {
  appendHtml(getChatContainer(), webviewHtml({ name: `${name}-slack`, url }))

  const webview = document.querySelector(
    `.chat-container webview#service-${name}-slack`,
  )

  listenToSingleWebview(webview)
}

module.exports = {
  createWebViews,
  addWebview,
  setActiveWindowFromKeyDown,
  setActiveChatScreen,
}
