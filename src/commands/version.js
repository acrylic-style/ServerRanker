const { config, Command } = require('../server-ranker')
const pkg = require('../../package.json')
const git = require('simple-git/promise')

module.exports = class extends Command {
  constructor() {
    super('version')
  }

  async run(msg) {
    msg.channel.send(`ServerRanker v${pkg.version} @ ${(await git().revparse(['HEAD'])).slice(0, 7)}\n - Source Code: ${pkg.repository}\n - Bot owners: ${config.owners.map(u => ` \* ${msg.client.users.get(u).tag}`).join('\n')}`)
  }
}
