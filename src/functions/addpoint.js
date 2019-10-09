const data = require('../data')
const generate = require('./genpoint.js')

module.exports = async msg => {
  if (!msg.guild) return
  const random = generate()
  const multiplierCount = await data.activatedMultipliers(msg.guild.id)
  const times = (await data.getPersonalPointBoost(msg.author.id)/100) + multiplierCount + 1
  await data.addUserPoint(msg.author.id, random * times)
  await data.addServerPoint(msg.guild.id, random * times)
}
