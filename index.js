const { LoggerFactory } = require('logger.js')
const logger = LoggerFactory.getLogger('main', 'blue')
let client

const start = async () => {
  logger.info('Booting...')
  client = require('./client')
}

const stop = async () => {
  await client.destroy()
  logger.info('Bot has been stopped.')
  client = null
  Object.keys(require.cache).forEach(e => { !e.endsWith('.js') || delete require.cache[e]})
}

const restart = async () => {
  logger.info('Restarting!')
  await stop()
  await start()
}

process.on('restart', () => restart())

start()
