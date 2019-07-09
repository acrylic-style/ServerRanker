const initTime = Date.now()
const ServerRanker = require('./src/server-ranker')
const logger = ServerRanker.Logger.getLogger('client', 'cyan')
logger.info('Initializing')
const data = require('./src/data')
const log = require('./src/log')
const dispatcher = require('bot-framework/dispatcher')
//const { commands } = require('bot-framework/commands')
const moment = require('moment')
const args = require('minimist')(process.argv.slice(2))
const DBL = require('dblapi.js')
const emojis = require('emojilib/emojis')
const client = new ServerRanker.Discord.Client()
const { config } = ServerRanker
const expRatelimit = new Set()
//const cmdRatelimit = new Set()
const globalRatelimit = new Set()
const globRatelimitData = {}
//const cmdRatelimitData = {}
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
  setInterval(() => {
    if (Date.now() > config.battlepass.seasonEndsAt) {
      logger.info(`Season ${config.battlepass.currentSeason} has ended!`)
    }
  }, 1000 * 60)
})

client.on('message', async msg => {
  if (msg.author.bot || msg.system) return
  log.messageLog(msg)
  const server = msg.guild ? await data.getServer(msg.guild.id) : { prefix: globalprefix, language: 'en' }
  const user = await data.getUser(msg.author.id)
  const prefix = server.prefix || globalprefix
  await data.updateUserTag(msg.author.id, msg.author.tag)
  const lang = ServerRanker.commons.language.get(user.language || server.language || 'en')
  if (msg.guild && !expRatelimit.has(msg.author.id)) {
    expRatelimit.add(msg.author.id)
    await ServerRanker['functions']['addpoint'](msg)
    await ServerRanker['functions']['addexp'](msg)
  }
  setTimeout(() => {
    expRatelimit.delete(msg.author.id)
  }, 60 * 1000)
  if ((msg.content === `<@${msg.client.user.id}>` || msg.content === `<@!${msg.client.user.id}>`) && msg.attachments.size === 0)
    return msg.channel.send(f(lang.prefixis, server.prefix))
  if (msg.content.startsWith(prefix)) {
    if (!msg.content.startsWith(`${prefix}stop`)) ServerRanker.commons.temp.processing.add(msg.id)
    ServerRanker.commons.temp.commands++
    if (globalRatelimit.has(msg.author.id)) {
      const reply = await msg.reply(`Cooldown! You have to wait ${(globRatelimitData[msg.author.id].endsAt-Date.now())/1000} seconds.`)
      reply.delete(10000)
      return
    }
    dispatcher(msg, lang, prefix, config.owners, prefix).catch(e => {
      logger.error(e.stack || e)
      msg.react(emojis['x']['char'])
    })
    if (!globalRatelimit.has(msg.author.id)) {
      globRatelimitData[msg.author.id] = { endsAt: Date.now() + 3000 }
      globalRatelimit.add(msg.author.id)
      setTimeout(() => {
        globalRatelimit.delete(msg.author.id)
      }, 3000)
    }
    /*
    if (!msg.member.hasPermission(8) && !cmdRatelimit.has(msg.author.id)) {
      const [, command] = /(.*?)(\s{1,}|)/g.exec(msg.content.replace(prefix, ''))
      if (!commands[command] || !commands[command].cooldown || commands[command].cooldown <= 3000) return
      const ct = commands[command].cooldown
      if (cmdRatelimitData[msg.author.id] && cmdRatelimitData[msg.author.id].endsAt < (Date.now()+ct)) cmdRatelimitData[msg.author.id] = { endsAt: Date.now() + ct }
      cmdRatelimit.add(msg.author.id)
      setTimeout(() => {
        cmdRatelimit.delete(msg.author.id)
        delete cmdRatelimitData[msg.author.id]
      }, ct)
    }
    */
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

logger.info('Waiting for database...')
process.once('dbready', () => {
  logger.info('Logging in...')
  client.login(config['token'])
})

process.on('SIGINT', async () => {
  await client.destroy()
  logger.info('Successfully disconnected from Discord.')
  process.exit()
})

module.exports = client
