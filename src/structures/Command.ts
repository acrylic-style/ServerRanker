import Discord = require('discord.js')
const { Permissions } = Discord

class Command {
  name: string;
  options: {
    alias: any[];
    args: any[];
    permission: number;
    allowedIn: string[];
    enabled: boolean;
  };
  allowedIn: string[];
  enabled: boolean;
  alias: string[];
  args: any[];
  permission: Discord.Permissions;
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
      enabled: true,
    }, options)

    this.allowedIn = this.options.allowedIn
    this.enabled = this.options.enabled
    this.alias = this.options.alias
    this.args = this.options.args
    this.permission = new Permissions(this.options.permission).freeze()
  }

  /**
   * @abstract
   */
  async run(msg, lang, args, opts) {}

  async start(msg, lang, args, opts) {
    if (!this.allowedIn.includes(msg.channel.constructor.name)) return msg.channel.send(require('string-format')(lang.not_allowed_in_here, this.allowedIn.join(', ')))
    return await this.run(msg, lang, args, opts)
  }

  /**
   * @abstract
   * @param {Discord.Message} msg
   */
  isAllowed(msg, owners) {
    return !msg.guild || msg.member.hasPermission(this.permission.bitfield)
  }
}

export = Command
