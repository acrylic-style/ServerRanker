const initTime = new Date()
const ServerRanker = require('./src/server-ranker')
const client = new ServerRanker.Discord.Client()
const { config } = ServerRanker
const DBL = require('dblapi.js')
const logger = ServerRanker.Logger.getLogger('main', 'blue')
logger.info('Initializing')
const moment = require('moment')
const dispatcher = require('./src/dispatcher')
const args = ServerRanker.commons.parser(process.argv.slice(2))
const ratelimited = new Set()
const log = require('./src/log')
const globalprefix = args['prefix'] || config['prefix']
const data = require('./src/data')

client.on('reconnecting', () => {
  logger.warn('Disconnected from WebSocket, reconnecting!')
})

client.on('resume', retried => {
  logger.warn(`Reconnected. (${retried} times)`)
})

client.on('ready', async () => {
  if (config.dbl) new DBL(config.dbl, client)
  client.user.setActivity(`${globalprefix}ping | ${client.guilds.size} guilds`)
  client.setTimeout(() => {
    logger.info('I got ' + ServerRanker.commons.temp.commands + ' commands today!')
    ServerRanker.commons.temp.commands = 0
  }, moment().endOf('day').toDate().getTime() - new Date().getTime())
  logger.info(`ServerRanker is ready! (${client.readyAt.getTime()-initTime.getTime()}ms)`)
})

client.on('message', async msg => {
  if (msg.author.bot || msg.system) return
  log.messageLog(msg)
  const serveruser = msg.guild ? await data.data(msg.guild.id, msg.author.id) : await data.user(msg.author.id)
  const settings = serveruser.server
  const prefix = settings.data.prefix || config['prefix'] || 'sr!'
  const user = serveruser.user
  const lang = ServerRanker.commons.language.get(user.data.language || settings.data.language || 'en')
  if (!ratelimited.has(msg.author.id)) {
    ratelimited.add(msg.author.id)
    await ServerRanker['functions']['addpoint'](settings, user)
  }
  setTimeout(() => {
    ratelimited.delete(msg.author.id)
  }, 60 * 1000)
  if (msg.content.startsWith(prefix)) {
    ServerRanker.commons.temp.commands++
    dispatcher(serveruser, msg, lang)
  }
})

client.on('guildCreate', guild => {
  logger.info(`Discovered new guild: ${guild.name}(${guild.id})`)
  client.user.setActivity(`${globalprefix}ping | ${client.guilds.size} guilds`)
})

client.on('guildDelete', guild => {
  logger.info(`Disappeared guild: ${guild.name}(${guild.id})`)
  client.user.setActivity(`${globalprefix}ping | ${client.guilds.size} guilds`)
})

logger.info('Logging in...')
client.login(config['token'])

process.on('SIGINT', async () => {
  await client.destroy()
  logger.info('Successfully disconnected from Discord.')
  process.exit()
})
