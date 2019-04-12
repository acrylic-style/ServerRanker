const { Permissions } = require('discord.js')

class Command {
  /**
   * Command options
   * @typedef CommandOptions
   * @property {Array<string>} alias
   * @property {Array<string>} args
   * @property {["TextChannel", "DMChannel", "GroupDMChannel"]} allowedIn
   * @property {number} permission
   * @property {boolean} enabled
   */

  /**
   * Construct this Command Instance.
   *
   * If not extend this Class, doesn't work your command.
   * @param {string} name Command name
   * @param {CommandOptions} options options
   * @constructor
   */
  constructor(name, options = {}) {
    if (!name) throw new TypeError('You must specify command name.')
    this.name = name

    this.options = Object.assign({
      alias: [],
      args: [],
      permission: 0,
      allowedIn: ['TextChannel', 'DMChannel', 'GroupDMChannel'],
      requiredOwner: false,
      enabled: true,
    }, options)

    this.allowedIn = this.options.allowedIn
    this.enabled = this.options.enabled
    this.alias = this.options.alias
    this.args = this.options.args
    this.requiredOwner = this.options.requiredOwner
    this.permission = new Permissions(this.options.permission).freeze()
  }

  /**
   * @abstract
   */
  async run() {}

  async start(msg, lang, ...args) {
    if (!this.allowedIn.includes(msg.channel.constructor.name)) return msg.channel.send(require('string-format')(lang.not_allowed_in_here, this.allowedIn.join(', ')))
    return await this.run(msg, lang, ...args)
  }

  /**
   * @abstract
   * @param {Discord.Message} msg
   */
  isAllowed(msg, owners) {
    if (this.requiredOwner) {
      return owners.includes(msg.author.id)
    } else if (!msg.guild) {
      return true
    } else if (msg.member.hasPermission(this.permission.bitfield)) {
      return true
    } else if (owners.includes(msg.author.id)) {
      msg.channel.send('Note: You\'re bypassing permission because you\'re listed as bot owner.')
      return true
    } else {
      return false
    }
  }
}

module.exports = Command
