const git = require('simple-git/promise')()
const { commons: { f }, Command, Logger } = require('../server-ranker')
const logger = Logger.getLogger('commands:update', 'purple')

module.exports = class extends Command {
  constructor() {
    super('update', { requiredOwner: true })
  }

  async run(msg, lang) {
    const message = await msg.channel.send(':stopwatch: Checking for version...')
    await git.fetch()
    const status = await git.status()
    if (!status.isClean()) return message.edit(':x: Workspace is not clean.')
    if (!status.tracking) return message.edit(`:x: Unknown branch in remote: \`${(await git.branch()).current}\``)
    if (status.behind === 0) return message.edit(':white_check_mark: Already up to date.')
    await message.edit(':recycle: Updating...')
    await git.pull().catch(e => {
      message.edit(f(lang.error, e))
      logger.error(e)
      return false
    })
    message.edit(':white_check_mark: Updated to latest version: `' + await git.revparse(['HEAD']) + '` (You need to restart bot for apply changes)')
  }
}
