const { Command } = require('../server-ranker')
const {
  setIntervalAsync,
  clearIntervalAsync,
} = require('set-interval-async/dynamic')
//const data = require('../data')
let running
let queue = []
let lastrun

module.exports = class extends Command {
  constructor() {
    super('recalc', { allowedIn: ['TextChannel'], permission: 8 })
  }

  async run(msg) {
    const callback = async () => {
      const asyncForEach = async (array, callback) => {
        const ids = array.map(c => c.id)
        const size = array.size-1
        for (let index = 0; index <= size; index++) {
          if (!array.has(ids[index])) {continue}
          await callback(array.get(ids[index]), index, {...array, size: size})
        }
      }
      lastrun = Date.now()
      running = msg.guild.id
      msg.channel.send('Fetching all messages. It may up to 28 hours.\n:warning: This is an ALPHA feature.\nBugs can happen often(Also queue system is may not work)!')
      let messages = []
      let lastmsg = { id: msg.id }
      const min = 100
      const max = 300
      let points = 0
      let maxpoints = 0
      let finished = false
      const f = setInterval(() => {
        if (!finished) return
        msg.channel.send(`Collected ${messages.length} messages.\nExpected random points: ${points} (Max points: ${maxpoints})`)
        running = null
        clearInterval(f)
      }, 1000 * 10)
      await asyncForEach(msg.guild.channels.filter(c => c.type === 'text').filter(c => c.memberPermissions(msg.guild.me).has(1024)), async (c, i, a) => {
        const interval = await setIntervalAsync(async () => {
          const fetchedMessages = await c.fetchMessages({ limit: 100, before: lastmsg.id })
          lastmsg = fetchedMessages.last() || msg.id
          messages = [...messages, ...fetchedMessages.filter(m => !m.author.bot)]
          if (fetchedMessages.size <= 99 || messages.length >= 1000000) {
            messages.forEach(() => {
              points = points + Math.round((Math.floor(Math.random() * (max + 1 - min)) + min) * 0.95)
              maxpoints = maxpoints + (300 * 0.95)
            })
            if (messages.length >= 1000000) {
              msg.channel.send(`:warning: You've reached fetch limit.\nCollected ${messages.length} messages.\nExpected random points: ${points} (Max points: ${maxpoints})`)
              running = null
            }
            clearInterval(f)
            clearIntervalAsync(interval)
            if (i >= a.size) finished = true
          }
        }, 1000 * 10)
      })
    }
    if (running === msg.guild.id) msg.channel.send('Already running recalculation in this server!')
    if (running) {
      if (queue.includes(msg.guild.id)) return msg.channel.send('This server is already in queue!')
      queue.push(msg.guild.id)
      const queueInterval = setInterval(async () => {
        queue.forEach((guildId, index) => {
          if (!running && guildId === msg.guild.id && index < 1) {
            clearInterval(queueInterval)
            queue = queue.slice(1)
            msg.channel.send('Starting in 5 minutes')
            running = msg.guild.id
            setTimeout(() => { callback() }, 300000)
          }
        })
      }, 1000 * 5)
      msg.channel.send('Waiting for queue...')
      return
    }
    const time = Date.now()
    if (!lastrun) return callback()
    if (time-lastrun < 300000) {
      setTimeout(() => { callback() }, 300000 - time-lastrun)
    } else callback()
  }
}
