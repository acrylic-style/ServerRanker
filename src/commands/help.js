const { Command, Discord } = require('../server-ranker')

module.exports = class extends Command {
  constructor() {
    super('help')
  }

  async run(msg, settings, user, lang) {
    const embed = new Discord.RichEmbed()
      .setTitle('List of commands')
      .addField('points', lang['commands']['points'])
      .addField('leaderboard', lang['commands']['leaderboard'])
      .addField('leaderboard_server', lang['commands']['leaderboard_server'])
      .addField('ping', lang['commands']['ping'])
      .addField('help', lang['commands']['help'])
      .addField('commands', lang['commands']['commands'])
      .setColor([0,255,0])
    msg.channel.send(embed)
  }
}
