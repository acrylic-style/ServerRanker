const { commons: { f }, Command } = require('../src/server-ranker')
const data = require('../src/data')

module.exports = class extends Command {
  constructor() {
    super('points')
  }

  async run(msg, lang) {
    const server = msg.guild ? await data.getServer(msg.guild.id) : Object.freeze({ prefix: 'sr!', language: 'en', point: -1 })
    const user = await data.getUser(msg.author.id)
    msg.channel.send(f(lang.points, user.point.toLocaleString(), server.point.toLocaleString(), Math.floor(Math.sqrt(4 + user.point/1000)-1), Math.floor(Math.sqrt(4 + server.point/3000)-1)))
  }
}
