(async () => {
  const start = Date.now()
  const { LoggerFactory } = require('logger.js')
  const logger = LoggerFactory.getLogger('migrations:resetTier', 'green')
  const { AtomicReference } = require('bot-framework')
  const data = require('../src/data')
  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }
  process.once('dbready', async () => {
    const users = await data.getUsers({ where: { bp_tier: { [data.Op.not]: null, [data.Op.gte]: 2 } } })
    logger.info('affected users: ' + users.length)
    logger.info('resetting battlepass tier to 1...')
    let usersLeft = users.length
    const startf = new AtomicReference(0)
    let numbers = []
    await asyncForEach(users, async user => {
      if (!(usersLeft % 10)) {
        let sum = 0
        numbers.forEach(v => sum += v)
        logger.info(`${usersLeft} users left.     ETA: ${Math.round(sum/numbers.length)} seconds`)
        numbers = []
      }
      await startf.set(Date.now())
      await data.User.update({ bp_tier: 1 }, { where: { user_id: user.user_id } })
      numbers.push((usersLeft*(Date.now()-(await startf.get())))/1000)
      usersLeft--
    })
    logger.info(`done, took ${(Date.now()-start)/1000} seconds`)
  })
})()
