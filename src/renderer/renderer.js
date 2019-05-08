const changeTabWithKeyboard = require('./keyboard-change-tab')
const { readAndSendNotificationCount } = require('./notification')
const { settingsPageInit } = require('./settings')
const { initSidebar } = require('./sidebar')
const { createWebViews, setActiveWindowFromKeyDown } = require('./webviews')

const listenForKeyPress = () => {
  changeTabWithKeyboard(({ value }) => {
    setActiveWindowFromKeyDown(value)
  })
}

initSidebar()
createWebViews()
listenForKeyPress()
readAndSendNotificationCount()
settingsPageInit()
