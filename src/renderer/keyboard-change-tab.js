module.exports = callback => {
  document.addEventListener('keydown', event => {
    if (event.metaKey && (Number(event.key) > 0 || Number(event.key) <= 9)) {
      callback.call(null, {
        eventType: 'keydown',
        value: Number(event.key) - 1,
      })
    }
  })
}
