const initTime = Date.now()
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
const f = ServerRanker.commons.f

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
  }, moment().endOf('day').toDate().getTime() - Date.now())
  logger.info(`ServerRanker is ready! (${client.readyAt.getTime()-initTime}ms)`)
})

client.on('message', async msg => {
  if (msg.author.bot || msg.system) return
  log.messageLog(msg)
  const server = await data.getServer(msg.guild.id)
  const user = await data.getUser(msg.author.id)
  const prefix = server.prefix || config['prefix'] || 'sr!'
  await data.updateUserTag(msg.author.id, msg.author.tag)
  const lang = ServerRanker.commons.language.get(user.language || server.language || 'en')
  if (!ratelimited.has(msg.author.id)) {
    ratelimited.add(msg.author.id)
    await ServerRanker['functions']['addpoint'](msg)
  }
  setTimeout(() => {
    ratelimited.delete(msg.author.id)
  }, 60 * 1000)
  if ((msg.content === `<@${msg.client.user.id}>` || msg.content === `<@!${msg.client.user.id}>`) && msg.attachments.size === 0)
    return msg.channel.send(f(lang.prefixis, server.prefix))
  if (msg.content.startsWith(prefix)) {
    ServerRanker.commons.temp.commands++
    dispatcher(msg, lang)
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
