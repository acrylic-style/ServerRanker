const { Command, Discord, commons: { f, data } } = require('../server-ranker')

module.exports = class extends Command {
  constructor() {
    super('help', { args: ['[Command]'] })
  }

  async run(msg, lang, args, sendDeletable) {
    const flip = (obj) => {
      const ret = {}
      Object.keys(obj).forEach((key) => {
        ret[obj[key]] = key
      })
      return ret
    }
    if (args[1]) {
      const { commands } = require(__dirname + '/../commands')
      const command = commands[args[1]]
      if (!command) return msg.channel.send(f(lang.no_command, args[1]))
      const embed = new Discord.RichEmbed()
        .setTitle('About this command')
        .setDescription(
          (lang.commands[args[1]] || ' - Not available information - ')
          + `\n\nUsage: ${(await data.getServer(msg.guild.id)).prefix}${args[1]} ${command.args !== [] ? command.args.join('\n') : ''}`
          + `\nAlias: ${command.alias !== [] ? command.alias.join('\n') : lang.no}`
          + `\nAllowed in: ${command.allowedIn.join(', ')}`
          + `\nRequired permissions for you: ${flip(Discord.Permissions.FLAGS)[command.permission]}`
          + `\nIs special command: ${command.requiredOwner ? lang.yes : lang.no}`
          + `\nIs enabled: ${command.enabled ? lang.yes : lang.no}`)
        .setTimestamp()
        .setColor([0,255,0])
      sendDeletable(embed)
    }
    const embed = new Discord.RichEmbed()
      .setTitle('List of commands')
      .addField('points', lang['commands']['points'])
      .addField('leaderboard', lang['commands']['leaderboard'])
      .addField('leaderboard server', lang['commands']['leaderboard_server'])
      .addField('ping', lang['commands']['ping'])
      .addField('help', lang['commands']['help'])
      .addField('commands', lang['commands']['commands'])
      .addField('recalc', lang['commands']['recalc'])
      .addField('version', lang['commands']['version'])
      .addField('Note!', `\`${(await data.getServer(msg.guild.id)).prefix}help [Command]\` for more help!`)
      .setColor([0,255,0])
    sendDeletable(embed)
  }
}
