const data = require('../data')
const generate = require('./genexp.js')

module.exports = async msg => {
  if (!msg.guild) return
  const { exp } = data.getUser(msg.author.id)
  const tier = Math.floor(Math.sqrt(4 + exp/2)-1)
  await data.addUserBattlePassTier(msg.author.id, tier)
  await data.addUserexp(msg.author.id, generate(msg))
}
