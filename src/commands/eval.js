const { commons: { f }, Logger, Command } = require('../server-ranker')
const logger = Logger.getLogger('commands:eval', 'lightpurple')

module.exports = class extends Command {
  constructor() {
    const opts = {
      args: ['<Code>'],
      requiredOwner: true,
    }
    super('eval', opts)
  }

  async run(msg, lang, args, sendDeletable) {
    if (!args[1]) return msg.channel.send(lang.invalid_args)
    args[1] = args[1].toString()
    !(async () => {
      if (args[1].includes('async:')) {
        args[1] = args[1].replace(/async:/g, '')
        return await eval(`(async () => {${args.slice(1).join(' ')}})()`)
      } else return await eval(args.slice(1).join(' '))
    })().then(data => {
      logger.info(`Eval by ${msg.author.tag} (${msg.author.id}), Result: ${data}`)
      sendDeletable(`:ok_hand: (${data})`)
    }).catch(e => {
      logger.info(`Eval[failed] by ${msg.author.tag} (${msg.author.id}), Result: \`${e.message}\``)
      sendDeletable(f(lang.error, e.message))
    })
  }
}
