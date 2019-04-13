const { Command, functions: { genpoint } } = require('../server-ranker')
//const data = require('../data')

module.exports = class extends Command {
  constructor() {
    super('recalc', { allowedIn: ['TextChannel'], permission: 8, requiredOwner: true })
    this.running = false
    this.queue = []
    this.lastRun = 0
  }

  async run(msg) {
    if (this.running === msg.guild.id)
      return msg.channel.send('Already running recalculation in this server!')
    if (this.queue.some(message => message.guild.id === msg.guild.id))
      return msg.channel.send('This server is already in queue!')
    this.queue.push(msg)
    if (!this.running) this.loop()
    else msg.channel.send('Waiting for queue...')
  }

  async loop() {
    if (!this.queue.length) return
    const elapsed = Date.now() - this.lastRun
    if (elapsed < 300000)
      return setTimeout(() => this.loop(), 300000 - elapsed)
    this.lastRun = Date.now()
    const msg = this.queue.shift()
    this.running = msg.guild.id
    await this.execute(msg)
    setTimeout(() => this.execute(), 300000)
  }

  async execute(msg) {
    const sigkillcb = async () => {
      await msg.channel.send('We\'ve got SIGKILL signal, please try again later, sorry!')
    }
    process.on('SIGKILL', sigkillcb)
    this.msg = await msg.channel.send('Fetching all messages. It may up to 28 hours.\n:warning: This is an ALPHA feature.\nBugs can happen often(Also queue system is may not work)!')
    const channels = msg.guild.channels.filter(c => c.type === 'text' && c.memberPermissions(msg.guild.me).has(1024))
    const messages = await this.series(Array.from(channels.values()))
    const maxpoints = messages * 300 * 0.95
    const points = Array.from({ length: messages }, () => Math.round(genpoint() * 0.95)).reduce((p, c) => p + c, 0)
    const warning = messages >= 1000000 ? ':warning: You\'ve reached fetch limit.\n' : ''
    msg.channel.send(warning + `Collected ${messages} messages.\nExpected random points: ${points} (Max points: ${maxpoints})`)
    this.running = null
    process.off('SIGKILL', sigkillcb)
  }

  async series(channels, before, total = 0) {
    if (!channels.length) return total
    const channel = channels.shift()
    const sum = total + await this.fetch(channel, before)
    if (sum >= 1000000) return sum
    this.msg.edit(`Fetching all messages... [Collected ${sum} messages]`)
    return await this.series(channels, before, sum)
  }

  fetch(channel, before, size = 0) {
    return new Promise(async resolve => {
      const messages = await channel.fetchMessages({ limit: 100, before })
      const sum = size + messages.filter(m => !m.author.bot).size
      if (messages.size <= 99 || sum >= 1000000) return resolve(sum)
      setTimeout(() => resolve(this.fetch(channel, messages.last().id, sum)), 10e3)
    })
  }
}
