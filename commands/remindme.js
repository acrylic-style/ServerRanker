const { Command } = require('../src/server-ranker')

module.exports = class extends Command {
  constructor() {
    const opts = {
      args: ['<time in minutes>'],
    }
    super('remindme', opts)
  }

  async run(msg, lang, args, sendDeletable) {
    if (!args[1]) return await sendDeletable(lang.invalid_args)
    const number = Number.parseInt(args[1])
    if (isNaN(number)) return await sendDeletable('Please specify valid number.')
    setTimeout(() => {
      msg.channel.send(`${msg.author}, ${args.slice(2)}`)
    }, number*60*1000)
    sendDeletable(`Ok, I'll remind you in ${number} minutes.`)
  }
}
