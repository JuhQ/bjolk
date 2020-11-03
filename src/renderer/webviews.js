const { getActiveChat, setActiveChat } = require('./localstorage')
const { getServices, getVisibleServices } = require('./components/services')
const { getDoNotDisturb } = require('./components/do-not-disturb')
const {
  setHtml,
  appendHtml,
  removeClass,
  addClass,
  getButtons,
  shortenName,
} = require('./utils')

const setActiveChatScreen = (name) => {
  removeClass('.chat-window.active', 'active')
  addClass(`#service-${name}.chat-window`, 'active')

  removeClass('.sidebar .chats button.active', 'active')
  addClass(`#button-${name}`, 'active')

  setActiveChat(name)
}

const setActiveWindowFromKeyDown = (index) => {
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

const setChatButtonNotificationCount = ({ service, value }) => {
  const button = document.querySelector(`button#button-${service} span`)
  if (button) {
    if (value !== button.count) {
      const serviceName = shortenName(service)

      button.count = value
      const notification = value ? `<strong>(${value})</strong> ` : ''

      setHtml(button, `${notification}${serviceName}`)
    }
  }
}

const listenToSingleWebview = (webview) => {
  // hack
  if (webview.customListenerAdded) {
    return
  }

  webview.addEventListener('dom-ready', () => {
    // eslint-disable-next-line no-param-reassign
    webview.customListenerAdded = true
    webview.addEventListener('ipc-message', (event) => {
      if (event.channel.eventType === 'keydown') {
        setActiveWindowFromKeyDown(event.channel.value)
      }

      if (!getDoNotDisturb()) {
        if (event.channel.eventType === 'chat-notification') {
          setChatButtonNotificationCount(event.channel)
        }
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

const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'

const webviewHtml = ({ name, url }) => `<webview
    src="${url}"
    useragent="${userAgent}"
    preload="../renderer/preload.js"
    id="service-${name}"
    class="chat-window">
  </webview>`

const getChatContainer = () => document.querySelector('.chat-container')

const createChatViews = () => {
  const container = getChatContainer()

  setHtml(container, '')

  const visibleServices = getVisibleServices()
  const services = getServices().filter(({ name }) =>
    visibleServices.includes(name),
  )

  services.forEach(({ name, url }) => {
    appendHtml(container, webviewHtml({ name, url }))
  })

  listenToWebviews()
}

const createWebViews = () => {
  createChatViews()
  activateCurrentChat()
}

const addWebview = ({ name, service, url }) => {
  appendHtml(
    getChatContainer(),
    webviewHtml({ name: `${name}-${service}`, url }),
  )

  const webview = document.querySelector(
    `.chat-container webview#service-${name}-${service}`,
  )

  listenToSingleWebview(webview)
}

module.exports = {
  createWebViews,
  createChatViews,
  addWebview,
  setActiveWindowFromKeyDown,
  setActiveChatScreen,
}
