(async () => {
  const start = Date.now()
  const { LoggerFactory } = require('logger.js')
  const logger = LoggerFactory.getLogger('migrations:resetExp', 'green')
  const { AtomicReference } = require('bot-framework')
  const data = require('../src/data')
  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }
  process.once('dbready', async () => {
    const users = await data.getUsers()
    logger.info('users: ' + users.length)
    logger.info('wiping all exp data...')
    const expStart = Date.now()
    let usersLeft = users.length
    const startf = new AtomicReference(0)
    const endf = new AtomicReference(80)
    let numbers = []
    await asyncForEach(users, async user => {
      if (!(usersLeft % 50)) {
        let sum = 0
        numbers.forEach(v => sum += v)
        logger.info(`${usersLeft} users left.     ETA: ${Math.round(sum/numbers.length)} seconds`)
        numbers = []
      }
      await startf.set(Date.now())
      await data.User.update(
        {
          exp: 0,
          rawexp: 0,
          bp_tier: 1,
          personal_expboost: 0,
          premium: false,
        }, { where: { user_id: user.user_id } })
      await endf.set(Date.now())
      numbers.push((usersLeft*((await endf.get())-(await startf.get())))/1000)
      usersLeft--
    })
    const expEnd = Date.now()
    logger.info('dropping all exp entries... (estimated time: unknown)')
    const dropStart = Date.now()
    await data.Exps.sync({ force: true })
    const dropEnd = Date.now()
    logger.info('all done, times:')
      .info(`wipe all exp data: ${(expEnd-expStart)/1000} seconds`)
      .info(`drop all exp entries: ${(dropEnd-dropStart)/1000} seconds`)
      .info(`overall: ${(Date.now()-start)/1000} seconds`)
  })
})()
