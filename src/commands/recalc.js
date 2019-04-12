const { Command } = require('../server-ranker')
const {
  setIntervalAsync,
  clearIntervalAsync,
} = require('set-interval-async/fixed')
//const data = require('../data')

module.exports = class extends Command {
  constructor() {
    super('recalc', { allowedIn: ['TextChannel'], permission: 8, requiredOwner: true })
    this.running = null
    this.queue = []
    this.lastrun = null
  }

  async run(msg) {
    if (this.running === msg.guild.id) return msg.channel.send('Already running recalculation in this server!')
    const callback = async () => {
      const asyncForEach = async (array, callback) => {
        const ids = array.map(c => c.id)
        const size = array.size-1
        for (let index = 0; index <= size; index++) {
          if (!array.has(ids[index])) {continue}
          await callback(array.get(ids[index]), index, {...array, size: size})
        }
      }
      this.lastrun = Date.now()
      this.running = msg.guild.id
      msg.channel.send('Fetching all messages. It may up to 28 hours.\n:warning: This is an ALPHA feature.\nBugs can happen often(Also queue system is may not work)!')
      let messages = 0
      let lastmsg = { id: msg.id }
      const min = 100
      const max = 300
      const finished = []
      const f = setInterval(() => {
        if (finished.some(f => !f)) return
        const maxpoints = messages * 300 * 0.95
        const points = Array.from({ length: messages }, () => 
          Math.round((Math.floor(Math.random() * (max + 1 - min)) + max) * 0.95)).reduce((p, c) => p + c)
        msg.channel.send(`Collected ${messages} messages.\nExpected random points: ${points} (Max points: ${maxpoints})`)
        this.running = null
        clearInterval(f)
      }, 1000 * 10)
      await asyncForEach(msg.guild.channels.filter(c => c.type === 'text').filter(c => c.memberPermissions(msg.guild.me).has(1024)), async (c, i) => {
        finished[i] = false
        const interval = await setIntervalAsync(async () => {
          const fetchedMessages = await c.fetchMessages({ limit: 100, before: lastmsg })
          lastmsg = fetchedMessages.last().id
          messages = messages + fetchedMessages.filter(m => !m.author.bot).size
          if (fetchedMessages.size <= 99 || messages >= 1000000) {
            if (messages >= 1000000) {
              const maxpoints = messages * 300 * 0.95
              const points = Array.from({ length: messages }, () => 
                Math.round((Math.floor(Math.random() * (max + 1 - min)) + max) * 0.95)).reduce((p, c) => p + c)
              msg.channel.send(`:warning: You've reached fetch limit.\nCollected ${messages} messages.\nExpected random points: ${points} (Max points: ${maxpoints})`)
              this.running = null
            }
            clearIntervalAsync(interval)
            finished[i] = true
          }
        }, 1000 * 10)
      })
    }
    if (this.running) {
      if (this.queue.includes(msg.guild.id)) return msg.channel.send('This server is already in queue!')
      this.queue.push(msg.guild.id)
      const queueInterval = setInterval(async () => {
        if (!this.running && this.queue[0] === msg.guild.id) {
          clearInterval(queueInterval)
          this.queue = this.queue.slice(1)
          msg.channel.send('Starting in 5 minutes')
          this.running = msg.guild.id
          setTimeout(() => { callback() }, 300000)
        }
      }, 1000 * 5)
      msg.channel.send('Waiting for queue...')
      return
    }
    const time = Date.now()
    if (!this.lastrun) return callback()
    if (time-this.lastrun < 300000) {
      setTimeout(() => { callback() }, 300000 - (time-this.lastrun))
    } else callback()
  }
}
