const ServerRanker = require('../src/server-ranker')
const { config, commons: { f }, Discord, Command } = ServerRanker
const moment = require('moment')
const data = require('../src/data')
const rewards = require('../src/rewards.yml')

module.exports = class extends Command {
  constructor() {
    super('battlepass')
  }

  async run(msg, lang, args, sendDeletable) {
    const n = tier => {
      const t = rewards[`season${config.battlepass.currentSeason}`]['normal'][`tier${tier}`]
      return t ? t.name : '(None)'
    }
    const p = tier => {
      const t = rewards[`season${config.battlepass.currentSeason}`]['premium'][`tier${tier}`]
      return t ? t.name : '(None)'
    }
    const val = tier => `${n(tier) || p(tier)}`
    const user = await data.getUser(msg.author.id)
    const tier = user.bp_tier || Math.min(Math.floor(Math.sqrt(4 + user.exp/2)-1), 100)
    const embed = new Discord.RichEmbed()
      .setTitle(f(lang['battlepass'], config.battlepass.currentSeason) + `${msg.author.premium ? ' (Premium)' : ' (FreePass, buy Discord Nitro for upgrade!... not yet.)'} - ${lang['tier']} ${tier}`)
      .setDescription(f(lang['seasonEndsAt'], moment(config.battlepass.seasonEndsAt).locale(user.language).fromNow(true)) + '\nTier Rewards:')
      .setColor([0,255,0])
      .addField(`Tier ${tier-5}`, val(tier-5))
      .addField(`Tier ${tier-4}`, val(tier-4))
      .addField(`Tier ${tier-3}`, val(tier-3))
      .addField(`Tier ${tier-2}`, val(tier-2))
      .addField(`Tier ${tier-1}`, val(tier-1))
      .addField(`Tier ${tier}`, val(tier))
      .addField(`Tier ${tier+1}`, val(tier+1))
      .addField(`Tier ${tier+2}`, val(tier+2))
      .addField(`Tier ${tier+3}`, val(tier+3))
      .addField(`Tier ${tier+4}`, val(tier+4))
      .addField(`Tier ${tier+5}`, val(tier+5))
    sendDeletable(embed)
  }
}
