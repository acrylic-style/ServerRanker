const { Command, Discord, commons: { f } } = require('../server-ranker')

module.exports = class extends Command {
  constructor() {
    super('help', { args: ['[Command]'] })
  }

  async run(msg, lang, args, sendDeletable) {
    if (args[1]) {
      const { commands } = require(__dirname + '/../commands')
      const command = commands[args[1]]
      if (!command) return msg.channel.send(f(lang.no_command, args[1]))
      const embed = new Discord.RichEmbed()
        .setTitle('About this command')
        .setDescription(
          (lang.commands[args[1]] || ' - Not available information - ')
          + `\n\nUsage: ${args[0]}${args[1]} ${command.args ? command.args.join('\n') : ''}`
          + `\nAlias: ${command.alias ? command.alias.join('\n') : lang.no}`)
        .setTimestamp()
        .setColor([0,255,0])
      return msg.channel.send(embed)
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
      .addField('Note!', `${args[0]}${args[1]} [Command] for more help!`)
      .setColor([0,255,0])
    sendDeletable(embed)
  }
}
