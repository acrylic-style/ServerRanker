const util = require('../util')

module.exports = async (settings, user) => {
  const min = 100
  const max = 300
  const random = Math.floor(Math.random() * (max + 1 - min)) + min
  settings.data.multipliers.forEach((multiplier, index) => {
    if (!multiplier.expires || multiplier.expires < new Date().getTime()) {
      settings.data.multipliers.splice(index, 1) // don't use "delete"
    }
  });
  await util.repeat(async () => {
    settings.data.point = settings.data.point + random
    user.data.point = user.data.point + random
  }, settings.data.multipliers.length+1)
  await settings.write(settings.data)
  await user.write(user.data)
}
