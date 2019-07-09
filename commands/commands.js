const ServerRanker = require('../src/server-ranker')
const { commons: { f }, Command } = ServerRanker

module.exports = class extends Command {
  constructor() {
    super('commands')
  }

  async run(msg, lang, args, sendDeletable) {
    sendDeletable(f(lang.today_commands, ServerRanker.commons.temp.commands))
  }
}
