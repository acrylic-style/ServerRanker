import f = require('string-format')
import Logger = require('./util/logger')
const logger = Logger.getLogger('commands', 'yellow')
import _commands = require('./commands')
const commands = _commands.commands
import _levenshtein = require('fast-levenshtein')
const levenshtein = _levenshtein.get
const c = require('./config.yml')
import argsresolver = require('./util/parser')
import data = require('./data')

async function runCommand(command, msg, lang) {
  const server = await data.getServer(msg.guild.id)
  if (!command.enabled) return msg.channel.send(f(lang.disabled_command, command.name))
  if (!command.isAllowed(msg, c.owners)) return msg.channel.send(lang.youdonthaveperm)
  logger.info(f(lang.issuedcmd, msg.author.tag, msg.content))
  const args = msg.content.replace(server.prefix, '').split(/\s{1,}/g)
  const opts = argsresolver(args.slice(1))
  const start = Date.now()
  await command.start(msg, lang, args.filter(a => !opts.args.includes(a)), opts).catch(e => {
    msg.channel.send(f(lang.error_occurred, command.name))
    logger.error(f(lang.error, e.stack || e))
  })
  const end = Date.now()
  if (end-start > 1000) {
    logger.warn(`${args[0]} took ${end-start}ms`)
  }
}

export = async function(msg, lang) {
  const server = await data.getServer(msg.guild.id)
  const [cmd] = msg.content.replace(server.prefix, '').replace(/\s{1,}/gm, ' ').split(' ')
  if (server.banned) return msg.channel.send(f(lang.error, 'Your server is banned.\nPlease contact to the this server -> https://discord.gg/xQQXp4B'))
  if (commands[cmd]) {
    await runCommand(commands[cmd], msg, lang)
  } else {
    const commandList = Object.keys(commands).map(cmd => ({ cmd, args: commands[cmd].args }))
    const similarCommand = commandList.map(item => ({ ...item, no: levenshtein(cmd, item.cmd) }))
    const cmds = similarCommand.sort((a, b) => a.no - b.no).filter(item => item.no <= 2)
    const list = cmds.map(item => `・\`${server.prefix}${item.cmd} ${item.args || ''}\``)
    const nocmd = f(lang.no_command, server.prefix, cmd)+'\n'
    if (list.length) msg.channel.send(nocmd + f(lang.didyoumean, list.join('\n')))
  }
}
