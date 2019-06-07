const initTime = Date.now()
const ServerRanker = require('./src/server-ranker')
const logger = ServerRanker.Logger.getLogger('main', 'blue')
logger.info('Initializing')
const data = require('./src/data')
const log = require('./src/log')
const dispatcher = require('bot-framework/dispatcher')
const moment = require('moment')
const args = require('minimist')(process.argv.slice(2))
const DBL = require('dblapi.js')
const emojis = require('emojilib/emojis')
const client = new ServerRanker.Discord.Client()
const { config } = ServerRanker
const ratelimited = new Set()
const globalprefix = args['prefix'] || config['prefix']
const { f } = ServerRanker.commons

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
  const server = msg.guild ? await data.getServer(msg.guild.id) : { prefix: globalprefix, language: 'en' }
  const user = await data.getUser(msg.author.id)
  const prefix = server.prefix || globalprefix
  await data.updateUserTag(msg.author.id, msg.author.tag)
  const lang = ServerRanker.commons.language.get(user.language || server.language || 'en')
  if (msg.guild && !ratelimited.has(msg.author.id)) {
    ratelimited.add(msg.author.id)
    await ServerRanker['functions']['addpoint'](msg)
    await ServerRanker['functions']['addexp'](msg)
  }
  setTimeout(() => {
    ratelimited.delete(msg.author.id)
  }, 60 * 1000)
  if ((msg.content === `<@${msg.client.user.id}>` || msg.content === `<@!${msg.client.user.id}>`) && msg.attachments.size === 0)
    return msg.channel.send(f(lang.prefixis, server.prefix))
  if (msg.content.startsWith(prefix)) {
    if (!msg.content.startsWith(`${prefix}stop`)) ServerRanker.commons.temp.processing.add(msg.id)
    ServerRanker.commons.temp.commands++
    dispatcher(msg, lang, prefix, config.owners).catch(e => {
      logger.error(e.stack || e)
      msg.react(emojis['x']['char'])
    })
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

logger.info('Waiting for db...')
process.once('dbready', () => {
  logger.info('Logging in...')
  client.login(config['token'])
})

process.on('SIGINT', async () => {
  await client.destroy()
  logger.info('Successfully disconnected from Discord.')
  process.exit()
})
