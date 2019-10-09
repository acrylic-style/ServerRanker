const { Command } = require('../src/server-ranker')
// const logger = Logger.getLogger('commands:settings', 'lightpurple')
const data = require('../src/data')

module.exports = class extends Command {
  constructor() {
    const opts = {
      args: [
        'config rewardsNotifications <true/false>',
      ],
      alias: ['config', 'setting'],
    }
    super('settings', opts)
  }

  async run(msg, lang, args, sendDeletable) {
    if (!args[1]) return await sendDeletable(lang.invalid_args)
    if (args[1] === 'config') {
      if (args[2] === 'rewardsNotifications') {
        if (args[3] !== 'true' && args[3] !== 'false') return await sendDeletable(`Settings ${args[2]} is \`${(await data.getUser(msg.author.id)).configRewardsNotifications}\`.`)
        data.updateUser(msg.author.id, args[2], Boolean(args[3]))
        return await msg.channel.send(`Updated ${args[2]} to: \`${args[3]}\``)
      } else return await sendDeletable(lang.invalid_args)
    } else return await sendDeletable(lang.invalid_args)
  }
}
