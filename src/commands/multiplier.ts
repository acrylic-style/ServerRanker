import ServerRanker = require('../server-ranker')
const { commons: { f }, Command, Discord } = ServerRanker
import moment = require('moment')
import data = require('../data')

export = class extends Command {
  confirms: {
    [id: string]: () => void
  };

  constructor() {
    super('multiplier', { allowedIn: ['TextChannel'] })
    this.confirms = {}
  }

  async run(msg, lang, args) {
    const user = await data.getUser(msg.author.id)
    if (args[1] === 'confirm') {
      if (!this.confirms[msg.author.id]) return msg.channel.send(lang.no_confirm)
      await this.confirms[msg.author.id]()
      delete this.confirms[msg.author.id]
      const multiplierCount = await data.countUserMultipliers(msg.author.id)
      msg.channel.send(f(lang.bought_multiplier, 2, 'sr!', multiplierCount))
    } else if (args[1] === 'list' && args[2] === 'server') {
      const embed = new Discord.RichEmbed()
        .setTitle('Activated point multipliers in this server')
        .setTimestamp()
        .setColor([0,255,0])
        .setDescription(lang.no_activated_multiplier)
      const multipliers = await data.getServerMultipliers(msg.guild.id)
      multipliers.forEach(e => {
        embed.setDescription('')
        embed.addField(`Point Multiplier (+${e['multiplier']}%) [Expires ${moment(e.expires).fromNow()}]`, `by ${msg.client.users.get(e.user_id)}`)
      })
      return msg.channel.send(embed)
    } else if (args[1] === 'list') {
      const embed = new Discord.RichEmbed()
        .setTitle('Your unused point multipliers')
        .setTimestamp()
        .setColor([0,255,0])
        .setDescription(lang.not_has_multiplier)
      const multipliers = await data.getUserMultipliers(msg.author.id)
      multipliers.forEach((e, i) => {
        embed.setDescription('')
        embed.addField(`#${i+1}`, `Point Multiplier (+${e['multiplier']}%)`)
      })
      msg.channel.send(embed)
    } else if (args[1] === 'activate') {
      const multipliers = await data.getUserMultipliers(msg.author.id)
      if (!multipliers[parseInt(args[2])-1]) return msg.channel.send(lang.invalid_args)
      const multiplier_id = multipliers[parseInt(args[2])-1].multiplier_id
      await data.activateMultiplier(multiplier_id, msg.guild.id, moment().add(1, 'days').toDate().getTime())
      const multiplier = await data.getMultiplier(multiplier_id)
      await msg.channel.send(f(lang.activated_multiplier, msg.author.tag, multiplier.multiplier))
    } else {
      const multiplierCount = await data.countUserMultipliers(msg.author.id)
      if (multiplierCount >= 10) return msg.channel.send(lang.only10)
      setTimeout(() => {
        delete this.confirms[msg.author.id]
      }, 10000)
      if (user.point <= 100000) return msg.channel.send(f(lang.not_enough_points, 100000))
      this.confirms[msg.author.id] = async () => {
        await data.subtractUserPoint(msg.author.id, 100000)
        await data.addMultiplier(msg.author.id, 100)
      }
      msg.channel.send(f(`${lang.user_points}\n${lang.areyousure}`, user.point, user.point - 100000))
    }
  }
}
