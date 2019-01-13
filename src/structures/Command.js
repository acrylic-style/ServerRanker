const { Permissions } = require('discord.js')

class Command {
  /**
   * Command options
   * @typedef CommandOptions
   * @property {Array<string>} alias
   * @property {Array<string>} args
   * @property {["textchannel", "dm", "gdm"]} allowedIn
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
      allowedIn: ['textchannel', 'dm', 'gdm'],
      enabled: true,
    }, options)

    this.enabled = this.options.enabled
    this.alias = this.options.alias
    this.args = this.options.args
    this.permission = new Permissions(this.options.permission).freeze()
  }

  /**
   * @abstract
   */
  async run() {}

  async start(...args) {
    return await this.run(...args)
  }

  /**
   * @abstract
   * @param {Discord.Message} msg
   */
  isAllowed({ member }) {
    return member.hasPermission(this.permission.bitfield)
  }
}

module.exports = Command
