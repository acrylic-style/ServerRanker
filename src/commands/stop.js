const { Command, commons: { temp } } = require('../server-ranker')

module.exports = class extends Command {
  constructor() {
    super('stop', { requiredOwner: true })
  }

  async run(msg) {
    const interval = setInterval(async () => {
      if (!temp.processing.size) {
        clearInterval(interval)
        await msg.channel.send(':wave:')
        process.kill(process.pid, 'SIGKILL')
      }
    }, 1000)
  }
}
