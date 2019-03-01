const data = require('../data')

module.exports = async msg => {
  const min = 100
  const max = 300
  const random = Math.floor(Math.random() * (max + 1 - min)) + min
  const multiplierCount = await data.countActivatedMultipliers(msg.guild.id)
  const times = multiplierCount + 1
  await data.addUserPoint(msg.author.id, random * times)
  await data.addServerPoint(msg.guild.id, random * times)
}
