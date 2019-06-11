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
    const n = rewards[`season${config.battlepass.currentSeason}`]['normal']
    const p = rewards[`season${config.battlepass.currentSeason}`]['premium']
    const user = await data.getUser(msg.author.id)
    const tier = user.bp_tier || Math.min(Math.floor(Math.sqrt(4 + user.exp/2)-1), 100)
    const embed = new Discord.RichEmbed()
      .setTitle(f(lang['battlepass'], config.battlepass.currentSeason) + `${msg.author.premium ? ' (Premium)' : ' (FreePass, buy Discord Nitro for upgrade!... not yet.)'} - ${lang['tier']} ${tier}`)
      .setDescription(f(lang['seasonEndsAt'], moment(config.battlepass.seasonEndsAt).locale(user.language).fromNow(true)) + '\nTier Rewards:')
      .setColor([0,255,0])
      .addField(`Tier ${tier-5}`, `${n[`tier${tier-5}`].name || '(None)'} | ${p[`tier${tier-5}`].name || '(None)'}`)
      .addField(`Tier ${tier-4}`, `${n[`tier${tier-4}`].name || '(None)'} | ${p[`tier${tier-4}`].name || '(None)'}`)
      .addField(`Tier ${tier-3}`, `${n[`tier${tier-3}`].name || '(None)'} | ${p[`tier${tier-3}`].name || '(None)'}`)
      .addField(`Tier ${tier-2}`, `${n[`tier${tier-2}`].name || '(None)'} | ${p[`tier${tier-2}`].name || '(None)'}`)
      .addField(`Tier ${tier-1}`, `${n[`tier${tier-1}`].name || '(None)'} | ${p[`tier${tier-1}`].name || '(None)'}`)
      .addField(`Tier ${tier}`, `${n[`tier${tier}`].name || '(None)'} | ${p[`tier${tier}`].name || '(None)'}`)
      .addField(`Tier ${tier+1}`, `${n[`tier${tier+1}`].name || '(None)'} | ${p[`tier${tier+1}`].name || '(None)'}`)
      .addField(`Tier ${tier+2}`, `${n[`tier${tier+2}`].name || '(None)'} | ${p[`tier${tier+2}`].name || '(None)'}`)
      .addField(`Tier ${tier+3}`, `${n[`tier${tier+3}`].name || '(None)'} | ${p[`tier${tier+3}`].name || '(None)'}`)
      .addField(`Tier ${tier+4}`, `${n[`tier${tier+4}`].name || '(None)'} | ${p[`tier${tier+4}`].name || '(None)'}`)
      .addField(`Tier ${tier+5}`, `${n[`tier${tier+5}`].name || '(None)'} | ${p[`tier${tier+5}`].name || '(None)'}`)
    sendDeletable(embed)
  }
}
