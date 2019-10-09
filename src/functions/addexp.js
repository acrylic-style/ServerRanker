const data = require('../data')
const generate = require('./genexp.js')

module.exports = async msg => {
  if (!msg.guild) return
  const tier = data.getTier((await this.getUser(msg.author.id)).exp)
  const oldTier = (await data.getUser(msg.author.id)).bp_tier
  if (oldTier < tier) {
    for (let i = oldTier; i < tier; i++) {
      const index = i+1
    }
  }
  await data.addUserexp(msg.author.id, generate(msg))
}
