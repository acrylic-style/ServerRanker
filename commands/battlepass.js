const ServerRanker = require('../src/server-ranker')
const { config, commons: { f }, Discord, Command } = ServerRanker
const moment = require('moment')
const data = require('../src/data')
const rewards = require('../src/rewards.yml')

module.exports = class extends Command {
  constructor() {
    super('battlepass')
    this.confirms = {}
  }

  async run(msg, lang, args, sendDeletable, prefix) {
    const user = await data.getUser(msg.author.id)
    if (args[1] === 'buy') {
      if (user.premium) return msg.channel.send(lang.alreadyPremium)
      setTimeout(() => {
        delete this.confirms[msg.author.id]
      }, 10000)
      if (user.point <= 1000000) return msg.channel.send(f(lang.not_enough_points, 1000000))
      this.confirms[msg.author.id] = async () => {
        await data.setPremiumState(msg.author.id, true)
      }
      return await msg.channel.send(f(`${lang.user_points}\n${lang.areyousure}`, user.point, user.point - 1000000))
    } else if (args[1] === 'confirm') {
      if (!this.confirms[msg.author.id]) return msg.channel.send(lang.no_confirm)
      await this.confirms[msg.author.id]()
      delete this.confirms[msg.author.id]
      return await msg.channel.send(lang.bought_battlepass)
    }
    const n = tier => {
      const t = rewards[`season${config.battlepass.currentSeason}`]['normal'][`tier${tier}`]
      return t ? t.name : '(None)'
    }
    const p = tier => {
      const t = rewards[`season${config.battlepass.currentSeason}`]['premium'][`tier${tier}`]
      return t ? t.name : '(None)'
    }
    const val = tier => `${n(tier)} | ${p(tier)}`
    const tier = user.bp_tier || require('../src/functions/getTier')(user.exp)
    const embed = new Discord.RichEmbed()
      .setTitle(f(lang['battlepass'], config.battlepass.currentSeason) + `${user.premium ? ' (PremiumPass)' : ` (FreePass, do \`${prefix}battlepass buy\` for get battlepass!)`} - ${lang['tier']} ${tier}`)
      .setDescription(f(lang['seasonEndsAt'], moment(config.battlepass.seasonEndsAt).locale(user.language).fromNow(true)) + '\n\nTier Rewards:')
      .setColor([0,255,0])
      .addField(`Tier ${tier-5}`, val(tier-5))
      .addField(`Tier ${tier-4}`, val(tier-4))
      .addField(`Tier ${tier-3}`, val(tier-3))
      .addField(`Tier ${tier-2}`, val(tier-2))
      .addField(`Tier ${tier-1}`, val(tier-1))
      .addField(`Tier ${tier} (Current)`, val(tier))
      .addField(`Tier ${tier+1}`, val(tier+1))
      .addField(`Tier ${tier+2}`, val(tier+2))
      .addField(`Tier ${tier+3}`, val(tier+3))
      .addField(`Tier ${tier+4}`, val(tier+4))
      .addField(`Tier ${tier+5}`, val(tier+5))
      .setFooter('Battlepass Tier is calculated from your exp.')
    return await sendDeletable(embed)
  }
}
