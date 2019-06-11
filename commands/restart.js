const { Command, commons: { temp } } = require('../src/server-ranker')

module.exports = class extends Command {
  constructor() {
    super('restart', { requiredOwner: true })
  }

  async run(msg) {
    const message = await msg.channel.send('Waiting for finish...')
    const interval = setInterval(async () => {
      if (temp.processing.size < 3) {
        clearInterval(interval)
        await message.edit(':wave:')
        process.emit('restart')
      }
    }, 100)
  }
}
