const { config, Command } = require('../server-ranker')
const pkg = require('../../package.json')
const git = require('simple-git/promise')

module.exports = class extends Command {
  constructor() {
    super('version')
  }

  async run(msg) {
    msg.channel.send(`ServerRanker v${pkg.version} @ ${(await git().revparse(['HEAD'])).slice(0, 7)}\n - Source Code: ${pkg.repository}\n - Bot owners:\n${config.owners.map(u => ` - \* \`${msg.client.users.get(u).tag}\` (ID: \`${u}\`)`).join('\n')}\n - Contact to Acrylic Style directly: Use DM or send mail to \`acrylicstyle@acrylicstyle.xyz\``)
  }
}
