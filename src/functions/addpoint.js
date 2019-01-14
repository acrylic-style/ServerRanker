module.exports = async (settings, user) => {
  const min = 100
  const max = 300
  const random = Math.floor(Math.random() * (max + 1 - min)) + min
  settings.data.point = settings.data.point + random
  user.data.point = user.data.point + random
  await settings.write(settings.data)
  await user.write(user.data)
}
