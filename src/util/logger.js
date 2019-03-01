const fs = require('fs')
const chalk = require('chalk')
const moment = require('moment')
const args = require('./parser')(process.argv.slice(2))
const util = {
  existsSync(path) {
    try { // eslint-disable-line
      fs.accessSync(path)
      return true
    } catch(err) {
      return false
    }
  },
  removeColor(str) {
    return str.replace(/\[..m/g, '').replace(/ /g, ' ').replace(/ /g, ' ').replace(//g, '')
  },
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

class Logger {
  /**
   * Do not call this method twice.
   *
   * @returns {Logger} A Logger instance
   */
  initLog() {
    this.initialized = true
    if (util.existsSync('latest.2.log')) fs.copyFileSync('latest.2.log', 'latest.3.log')
    if (util.existsSync('latest.1.log')) fs.copyFileSync('latest.1.log', 'latest.2.log')
    if (util.existsSync('latest.log')) fs.copyFileSync('latest.log', 'latest.1.log')
    fs.writeFileSync('latest.log', `--- The log begin at ${new Date().toLocaleString()} ---\n`)
    this.debug('The log file has initialized.', true)
    return this
  }

  /**
   * Configure this logger.
   * @param {boolean} debug
   * @returns {Logger} A Logger instance
   */
  config(debug = false) {
    this.debugging = debug
    return this
  }

  /**
   * Set thread name and color.
   *
   * @example const logger = require('./logger').getLogger('example', 'red')
   * @param {string} thread Thread name
   * @param {string} color Default: Random color, yellow, darkgray, red, lightred, green, lightpurple, white, cyan, purple, blue
   * @returns {Logger} A Logger instance
   */
  getLogger(thread, color = null, init = true) {
    if (!init) this.initLog = () => { }
    if (!this.initialized && init) this.initLog()
    const self = new Logger()
    self.thread = colors[color]
      ? colors[color](thread)
      : Object.values(colors)[Math.floor(Math.random() * colors.length)](thread)
    this.debugging = args['debugg']
    this.debug(`Registered logger for: ${thread}`, true)
    return self
  }
  /**
   *
   * @param {*} message Message of this log
   * @param {string} level error, warn, fatal, info, debug
   * @param {string} color color of chalk
   * @param {boolean} isLogger Is this called by myself?
   * @returns {void} <void>
   * @private
   */
  out(message, level, color, isLogger) {
    const date = chalk.white.bgCyan(`[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}]`) + chalk.reset()
    const thread = isLogger ? chalk.hex('#800080')('logger') : this.thread
    const coloredlevel = chalk`{${color} ${level}}`
    const data = `${date} ${thread}${chalk.reset()} ${coloredlevel}${chalk.reset()} ${chalk.green(message)}${chalk.reset()}`
    fs.appendFileSync('latest.log', `${util.removeColor(data)}\n`)
    console.info(data)
  }
  /**
   * Outputs info level message.
   *
   * @example logger.info('foo')
   *
   *
   * @example logger.warn('foo').info('bar')
   *
   *
   * @param {*} message
   * @param {boolean} isLogger Don't use this
   *
   * @returns {Logger} A Logger instance
   */
  info(message, isLogger = false) {
    this.out(message, 'info', 'blue', isLogger)
    return this
  }
  /**
   * Outputs debug level message.
   * Just debug message.
   *
   * @example logger.debug('foo')
   *
   *
   * @example logger.debug('foo').error('bar')
   *
   *
   * @param {*} message
   * @param {boolean} isLogger Don't use this
   *
   * @returns {Logger} A Logger instance
   */
  debug(message, isLogger = false) {
    if (this.debugging) this.out(message, 'debug', 'cyan', isLogger)
    return this
  }
  /**
   * Outputs warn level message.
   * Warning condition
   *
   * @example logger.warn('foo')
   *
   *
   * @example logger.warn('foo').error('bar')
   *
   *
   * @param {*} message
   * @param {boolean} isLogger Don't use this
   *
   * @returns {Logger} A Logger instance
   */
  warn(message, isLogger = false) {
    this.out(message, 'warn', 'bold.yellow', isLogger)
    return this
  }
  /**
   * Outputs error level message.
   * Error condition
   *
   * @example logger.error('foo')
   *
   *
   * @example logger.error('foo').debug('bar')
   *
   *
   * @param {*} message
   * @param {boolean} isLogger Don't use this
   *
   * @returns {Logger} A Logger instance
   */
  error(message, isLogger = false) {
    this.out(message, 'error', 'red', isLogger)
    return this
  }
  /**
   * Outputs fatal level message.
   * Fatal Error, may need action immediately
   *
   * @example logger.fatal('foo')
   *
   *
   * @example logger.fatal('foo').error('bar')
   *
   *
   * @param {*} message
   * @param {boolean} isLogger Don't use this
   *
   * @returns {Logger} A Logger instance
   */
  fatal(message, isLogger = false) {
    this.out(message, 'fatal', 'redBright.bold', isLogger)
    return this
  }
  /**
   * Outputs emerg level message.
   * Use on going system is unusable(e.g. uncaughtException)
   *
   * @example logger.emerg('foo')
   *
   *
   * @example logger.emerg('foo').emerg('bar')
   *
   *
   * @param {*} message
   *
   * @returns {Logger} A Logger instance
   */
  emerg(message) {
    this.out(message, 'emerg', 'red.bold', false)
    return this
  }
}

module.exports = new Logger()
