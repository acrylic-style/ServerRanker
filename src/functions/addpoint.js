const data = require('../data')

module.exports = async msg => {
  const min = 100
  const max = 300
  const random = Math.floor(Math.random() * (max + 1 - min)) + min
  const multipliers = await data.getActivatedMultipliers(msg.guild.id)
  const times = multipliers.length + 1
  await data.addUserPoint(msg.author.id, random * times)
  await data.addServerPoint(msg.guild.id, random * times)
}
