const util = require('../util')

module.exports = async (settings, user) => {
  const min = 100
  const max = 300
  const random = Math.floor(Math.random() * (max + 1 - min)) + min
  settings.data.multipliers.forEach((multiplier, index) => {
    if (!multiplier.expires || multiplier.expires < Date.now()) {
      settings.data.multipliers.splice(index, 1) // don't use "delete"
    }
  });
  const times = settings.data.multipliers.length + 1
  settings.data.point += random * times
  user.data.point += random * times
  await settings.write(settings.data)
  await user.write(user.data)
}
