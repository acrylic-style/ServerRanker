(async () => {
  const start = Date.now()
  const { LoggerFactory } = require('logger.js')
  const logger = LoggerFactory.getLogger('migrations:resetExp', 'green')
  const data = require('../src/data')
  process.once('dbready', async () => {
    logger.info('users: ' + (await data.getAllUsers()).length)
    logger.info('wiping all exp data... (estimated time: unknown)')
    const expStart = Date.now()
    await data.User.update(
      {
        exp: 0,
        rawexp: 0,
        bp_tier: 1,
        personal_expboost: 0,
        premium: false,
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
