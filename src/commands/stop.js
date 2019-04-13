const { Command } = require('../server-ranker')

module.exports = class extends Command {
  constructor() {
    super('stop', { requiredOwner: true })
  }

  async run(msg) {
    msg.channel.send(':wave:')
    process.kill(process.pid, 'SIGKILL')
  }
}
