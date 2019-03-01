import ServerRanker = require('../server-ranker')
const { Command, Discord } = ServerRanker

export = class extends Command {
  constructor() {
    super('help')
  }

  async run(msg, lang) {
    const embed = new Discord.RichEmbed()
      .setTitle('List of commands')
      .addField('points', lang['commands']['points'])
      .addField('leaderboard', lang['commands']['leaderboard'])
      .addField('leaderboard server', lang['commands']['leaderboard_server'])
      .addField('ping', lang['commands']['ping'])
      .addField('help', lang['commands']['help'])
      .addField('commands', lang['commands']['commands'])
      .setColor([0,255,0])
    msg.channel.send(embed)
  }
}
