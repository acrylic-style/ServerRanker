import ServerRanker = require('../server-ranker')
const { commons: { f }, Command } = ServerRanker

export = class extends Command {
  constructor() {
    super('commands')
  }

  async run(msg, lang) {
    msg.channel.send(f(lang.today_commands, ServerRanker.commons.temp.commands))
  }
}
