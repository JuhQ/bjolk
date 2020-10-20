module.exports = (callback) => {
  document.addEventListener('keydown', (event) => {
    const ctrlKey = event.metaKey || event.ctrlKey
    if (ctrlKey && (Number(event.key) > 0 || Number(event.key) <= 9)) {
      callback.call(null, {
        eventType: 'keydown',
        value: Number(event.key) - 1,
      })
    }
  })
}
