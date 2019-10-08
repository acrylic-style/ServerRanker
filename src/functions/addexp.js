const data = require('../data')
const generate = require('./genexp.js')

module.exports = async msg => {
  if (!msg.guild) return
  const { exp } = data.getUser(msg.author.id)
  await data.addUserexp(msg.author.id, generate(msg))
  const tier = require('./getTier')(exp)
  await data.addUserBattlePassTier(msg.author.id, tier)
}
