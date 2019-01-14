const f = require('string-format')
const logger = require('./util/logger').getLogger('commands', 'yellow')
const { commands } = require('./commands')
const levenshtein = require('fast-levenshtein').get
const c = require('./config.yml')
const argsresolver = require('./util/parser')

async function runCommand(command, settings, user, msg, lang) {
  if (!command.enabled) return msg.channel.send(f(lang.disabled_command, command.name))
  if (!command.isAllowed(msg, c.owners)) return msg.channel.send(lang.youdonthaveperm)
  logger.info(f(lang.issuedcmd, msg.author.tag, msg.content))
  const args = msg.content.replace(settings.data.prefix, '').split(/\s{1,}/g)
  const opts = argsresolver(args.slice(1))
  await command.start(msg, settings, user, lang, args.filter(a => !opts.args.includes(a)), opts).catch(e => {
    msg.channel.send(f(lang.error_occurred, command.name))
    logger.error(f(lang.error, e.stack || e))
  })
}

module.exports = async function(data, msg, lang) {
  const settings = data.server
  const user = data.user
  if ((msg.content === `<@${msg.client.user.id}>` || msg.content === `<@!${msg.client.user.id}>`) && msg.attachments.length === 0)
    return msg.channel.send(f(lang.prefixis, settings.data.prefix))
  if (msg.content.startsWith(settings.data.prefix)) {
    const [cmd] = msg.content.replace(settings.data.prefix, '').replace(/\s{1,}/gm, ' ').split(' ')
    if (settings.data.banned) return msg.channel.send(f(lang.error, 'Your server is banned.\nPlease contact to the this server -> https://discord.gg/xQQXp4B'))
    if (commands[cmd]) {
      await runCommand(commands[cmd], settings, user, msg, lang)
    } else {
      const commandList = Object.keys(commands).map(cmd => ({ cmd, args: commands[cmd].args }))
      const similarCommand = commandList.map(item => ({ ...item, no: levenshtein(cmd, item.cmd) }))
      const cmds = similarCommand.sort((a, b) => a.no - b.no).filter(item => item.no <= 2)
      const list = cmds.map(item => `・\`${settings.data.prefix}${item.cmd} ${item.args || ''}\``)
      const nocmd = f(lang.no_command, settings.data.prefix, cmd)+'\n'
      const message = await msg.channel.send(nocmd)
      if (list.length) message.edit(nocmd + f(lang.didyoumean, list.join('\n')))
    }
  }
}