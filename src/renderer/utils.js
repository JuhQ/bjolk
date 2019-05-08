const getButtons = () => document.querySelectorAll('.sidebar .chats button')
const negate = fn => data => !fn(data)
const setHtml = (element, html) => {
  // eslint-disable-next-line
  element.innerHTML = html
}
const appendHtml = (element, html) => {
  // eslint-disable-next-line
  element.innerHTML += html
}

const getElement = selector => document.querySelector(selector)

const addClass = (selector, classToAdd) =>
  !!getElement(selector) && getElement(selector).classList.add(classToAdd)

const removeClass = (selector, classToAdd) =>
  !!getElement(selector) && getElement(selector).classList.remove(classToAdd)

const filterDuplicates = list =>
  list.reduce((acc, item) => (acc.includes(item) ? acc : [...acc, item]), [])

const getSlackUrl = name => `https://${name}.slack.com/`

const getDomain = url => {
  const parser = document.createElement('a')
  parser.href = url

  return parser.hostname
}

const favicon = url =>
  `https://www.google.com/s2/favicons?domain=${getDomain(url)}`

module.exports = {
  addClass,
  removeClass,
  negate,
  filterDuplicates,
  getButtons,
  setHtml,
  appendHtml,
  getSlackUrl,
  favicon,
}
