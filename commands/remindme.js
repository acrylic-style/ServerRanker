const { Command } = require('../src/server-ranker')

module.exports = class extends Command {
  constructor() {
    const opts = {
      args: ['<time in minutes>'],
    }
    super('remindme', opts)
  }

  async run(msg, lang, args, sendDeletable) {
    if (!args[1]) return msg.channel.send(lang.invalid_args)
    const number = Number.parseInt(args[1])
    if (isNaN(number)) return await msg.channel.send('Please specify valid number.')
    setTimeout(() => {
      sendDeletable(`${msg.author}, ${args.slice(2)}`)
    }, number*60*1000)
  }
}
