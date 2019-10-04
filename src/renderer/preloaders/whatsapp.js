const { remote } = require('electron')

const webContents = remote.getCurrentWebContents()
const { session } = webContents

// All credit to Franz for whatsapp fix
// https://github.com/meetfranz/recipe-whatsapp/blob/master/webview.js
const checkWhatsapp = () => {
  setTimeout(() => {
    if (
      document.querySelector('body').innerHTML.includes('Google Chrome 36+')
    ) {
      window.location.reload()
    }
  }, 1000)

  window.addEventListener('beforeunload', async () => {
    try {
      session.flushStorageData()
      session.clearStorageData({
        storages: [
          'appcache',
          'serviceworkers',
          'cachestorage',
          'websql',
          'indexdb',
        ],
      })

      const registrations = await window.navigator.serviceWorker.getRegistrations()

      registrations.forEach(r => {
        r.unregister()
      })
    } catch (err) {
      // eslint-disable-next-line
      console.err(err)
    }
  })
}

module.exports = checkWhatsapp
