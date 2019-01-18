const { commons: { f }, Command, Discord } = require('../server-ranker')

module.exports = class extends Command {
  constructor() {
    super('multiplier', { allowedIn: ['TextChannel'] })
    this.confirms = {}
  }

  async run(msg, settings, user, lang, args) {
    if (args[1] === 'confirm') {
      if (!this.confirms[msg.author.id]) return msg.channel.send(lang.no_confirm)
      const data = await this.confirms[msg.author.id]()
      msg.channel.send(f(lang.bought_multiplier, 2, 'sr!', data.multipliers.length))
    } else if (args[1] === 'list') {
      const embed = new Discord.RichEmbed()
        .setTitle('Your unused point multipliers')
        .setTimestamp()
        .setDescription(lang.not_has_multiplier)
      user.data.multipliers.forEach((e, i) => {
        embed.setDescription('')
        embed.addField(`#${i}`, `Point Multiplier (${e['multiplier']}x)`)
      })
      msg.channel.send(embed)
    } else if (args[1] === 'activate') {
      if (!user.data.multipliers[parseInt(args[2])-1]) return msg.channel.send(lang.invalid_args)
      await msg.channel.send(f(lang.activated_multiplier, user.data.multipliers[parseInt(args[2])-1].multiplier))
      user.data.multipliers.splice(parseInt(args[2])-1, 1)
      await user.write(user.data)
      settings.data.multipliers.push({
        author: msg.author.id,
        multiplier: parseInt(args[2]),
      })
      await settings.data.write(settings.data)
    } else {
      if (user.data.multipliers.length >= 10) return msg.channel.send(lang.only10)
      setTimeout(() => {
        delete this.confirms[msg.author.id]
      }, 10000)
      if (user.data.point <= 100000) return msg.channel.send(f(lang.not_enough_points, 100000))
      this.confirms[msg.author.id] = async () => {
        user.data.point = user.data.point - 100000
        user.data.multipliers.push({
          multiplier: 2,
        })
        return await user.write(user.data)
      }
      msg.channel.send(f(`${lang.user_points}\n${lang.areyousure}`, user.data.point, user.data.point - 100000))
    }
  }
}
