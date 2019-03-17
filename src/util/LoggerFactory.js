const Logger = require('./Logger')
const chalk = require('chalk')
const moment = require('moment')
const fs = require('fs')
let init = false

const randomObject = obj => {
  const keys = Object.keys(obj)
  return obj[keys[ keys.length * Math.random() << 0]]
}

const colors = {
  yellow: chalk.bold.yellow,
  darkgray: chalk.gray,
  red: chalk.red,
  lightred: chalk.bold.red,
  green: chalk.green,
  lightpurple: chalk.bold.hex('#800080'),
  white: chalk.white,
  cyan: chalk.cyan,
  purple: chalk.hex('#800080'),
  blue: chalk.blue,
}

const date = moment().format('YYYY-MM-DD-HH-mm-ss')

process.on('uncaughtException', err => {
  fs.appendFileSync(`logs/latest.${date}.log`, (err && err.stack) ? err.stack : err)
  console.error((err && err.stack) ? err.stack : err)
  process.exit()
})

/**
 * Set thread name and color.
 *
 * @example const logger = require('./LoggerFactory').getLogger('example', 'red')
 * @param {string} thread Thread name
 * @param {string} color Default: Random color, yellow, darkgray, red, lightred, green, lightpurple, white, cyan, purple, blue
 * @returns {Logger} A Logger instance
 */
const getLogger = (thread, color = null) => {
  const self = new Logger(init, date)
  self.file = `logs/latest.${date}.log`
  init = true
  self.thread = Object.keys(colors).includes(color)
    ? colors[color](thread)
    : randomObject(colors)(thread)
  return self.debug(`Registered logger for: ${thread}`, true)
}

module.exports = { getLogger }
