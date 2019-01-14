const { commons: { f }, Command } = require('../server-ranker')

module.exports = class extends Command {
  constructor() {
    super('points', { allowedIn: ['TextChannel'] })
  }

  async run(msg, settings, user, lang) {
    msg.channel.send(f(lang.points, user.data.point.toLocaleString(), settings.data.point.toLocaleString(), Math.floor(Math.sqrt(4 + user.data.point/900)-1), Math.floor(Math.sqrt(4 + settings.data.point/1500)-1)))
  }
}
