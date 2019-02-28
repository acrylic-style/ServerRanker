const data = require('../data')

module.exports = async msg => {
  const min = 100
  const max = 300
  const random = Math.floor(Math.random() * (max + 1 - min)) + min
  /*
  settings.data.multipliers.forEach((multiplier, index) => {
    if (!multiplier.expires || multiplier.expires < Date.now()) {
      settings.data.multipliers.splice(index, 1) // don't use "delete"
    }
  })
  const times = settings.data.multipliers.length + 1
  */
  const times = 1
  await data.addUserPoint(msg.author.id, random * times)
  await data.addServerPoint(msg.guild.id, random * times)
}
