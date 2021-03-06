const { Command, Discord, config, commons: { f } } = require('../src/server-ranker')

module.exports = class extends Command {
  constructor() {
    super('help', { args: ['[Command]'] })
  }

  async run(msg, lang, args, sendDeletable) {
    if (args[1]) {
      const { commands } = require('bot-framework/commands')
      const command = commands[args[1]]
      if (!command) return msg.channel.send(f(lang.no_command, args[1]))
      const callback = p => {
        const nounderbar = p.replace(/([A-Z].*?)(_(.*?))/g, '$1 ')
        return nounderbar.replace(/\b[A-Z]{2,}\b/g, str => str.toLowerCase())
      }
      const embed = new Discord.RichEmbed()
        .setTitle('About this command')
        .setDescription(
          (lang.commands[args[1]] || ' - Not available information - ')
          + `\n\nUsage: ${config.prefix}${args[1]} ${command.args !== [] ? command.args.join('\n') : ''}`
          + `\nAlias: ${command.alias !== [] ? command.alias.join('\n') : lang.no}`
          + `\nAllowed in: ${command.allowedIn.join(', ')}`
          + `\nRequired permissions for you: ${command.permission.bitfield ? command.permission.toArray(false).map(callback).join(', ') : 'None'}`
          + `\nIs special command: ${command.requiredOwner ? lang.yes : lang.no}`
          + `\nIs enabled: ${command.enabled ? lang.yes : lang.no}`)
        .setTimestamp()
        .setColor([0,255,0])
      return sendDeletable(embed)
    }
    const embed = new Discord.RichEmbed()
      .setTitle('List of commands')
      .addField('points', lang['commands']['points'])
      .addField('multiplier', lang['commands']['multiplier'])
      .addField('leaderboard', lang['commands']['leaderboard'])
      .addField('leaderboard server', lang['commands']['leaderboard_server'])
      .addField('ping', lang['commands']['ping'])
      .addField('help', lang['commands']['help'])
      .addField('commands', lang['commands']['commands'])
      .addField('recalc', lang['commands']['recalc'])
      .addField('version', lang['commands']['version'])
      .addField('Note!', `\`${config.prefix}help [Command]\` for more help! (please view that help before asking for help)`)
      .setColor([0,255,0])
    sendDeletable(embed)
  }
}
