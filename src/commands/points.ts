import ServerRanker = require('../server-ranker')
const { commons: { f }, Command } = ServerRanker
import data = require('../data')

export = class extends Command {
  constructor() {
    super('points', { allowedIn: ['TextChannel'] })
  }

  async run(msg, lang) {
    const server = await data.getServer(msg.guild.id)
    const user = await data.getUser(msg.author.id)
    msg.channel.send(f(lang.points, user.point.toLocaleString(), server.point.toLocaleString(), Math.floor(Math.sqrt(4 + user.point/1000)-1), Math.floor(Math.sqrt(4 + server.point/3000)-1)))
  }
}
