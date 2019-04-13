const { Command } = require('../server-ranker')

module.exports = class extends Command {
  constructor() {
    super('stop', { requiredOwner: true })
  }

  async run(msg) {
    await msg.channel.send(':wave:')
    process.kill(process.pid, 'SIGKILL')
  }
}
