const ServerRanker = require('../src/server-ranker')
const { config, commons: { f }, Discord, Command } = ServerRanker
const moment = require('moment')
const data = require('../src/data')

module.exports = class extends Command {
  constructor() {
    super('battlepass')
  }

  async run(msg, lang, args, sendDeletable) {
    const user = await data.getUser(msg.author.id)
    const embed = new Discord.RichEmbed()
      .setTitle(f(lang['battlepass'], config.battlepass.currentSeason) + ` - ${lang['tier']} ${user.bp_tier || Math.floor(Math.sqrt(4 + user.exp/2)-1)}`)
      .setDescription(f(lang['seasonEndsAt'], moment(config.battlepass.seasonEndsAt).locale(user.language).fromNow(true)))
      .setColor([0,255,0])
    sendDeletable(embed)
  }
}
