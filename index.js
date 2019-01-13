const initTime = new Date()
const ServerRanker = require('./src/server-ranker')
const client = new ServerRanker.Discord.Client()
const logger = ServerRanker.Logger.getLogger('main', 'blue')
const moment = require('moment')
const args = ServerRanker.commons.parser(process.argv.slice(2))

if (['token', 'prefix'].some(e => !Object.keys(args).includes(e))) {
  const missing = ['token', 'prefix'].filter(e => !Object.keys(args).includes(e)).join(', ') + '.'
  logger.error('You must specify ' + missing)
  process.exit(1)
}

client.on('ready', async () => {
  client.user.setActivity(`${args['prefix']}ping | ${client.guilds.size} guilds`)
  client.setTimeout(() => {
    logger.info('I got ' + ServerRanker.commons.temp.commands + ' commands today!')
  }, moment().endOf('day').toDate().getTime() - new Date().getTime())
  logger.info(`ServerRanker is ready! (${client.readyAt.getTime()-initTime.getTime()}ms)`)
})

const dispatcher = require('./src/dispatcher')
const prefix = args['prefix']
client.on('message', async msg => {
  if (msg.author.bot || msg.system) return
  const lang = ServerRanker.commons.language.get(args['language'] || 'en')
  if (msg.content.startsWith(prefix)) {
    dispatcher(args, msg, lang)
    ServerRanker.commons.temp.commands++
  }
})

client.login(args['token'])

process.on('SIGINT', async () => {
  await client.destroy()
  logger.info('Successfully disconnected from Discord.')
  process.exit()
})
