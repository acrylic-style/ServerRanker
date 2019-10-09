(async () => {
  const start = Date.now()
  const { LoggerFactory } = require('logger.js')
  const logger = LoggerFactory.getLogger('migrations:makeColumnPersonalPointBoost', 'green')
  const data = require('../src/data')
  process.once('dbready', async () => {
    const expStart = Date.now()
    logger.info('removing personal_expboost column...')
    try { // eslint-disable-line no-restricted-syntax
      await data.query('alter table users drop column personal_expboost;')
    } catch (e) {
      logger.error('personal_expboost column does not exist. did they already removed?')
      logger.error(e.stack || e)
    }
    const expEnd = Date.now()
    const pointStart = Date.now()
    logger.info('adding personal_pointboost column...')
    try { // eslint-disable-line no-restricted-syntax
      await data.query('alter table users add column personal_pointboost;')
    } catch (e) {
      logger.error('couldn\'t create column!')
      logger.error(e.stack || e)
    }
    const pointEnd = Date.now()
    logger.info('all done, times:')
      .info(`remove personal_expboost: ${(expEnd-expStart)/1000} seconds`)
      .info(`add personal_pointboost: ${(pointEnd-pointStart)/1000} seconds`)
      .info(`overall: ${(Date.now()-start)/1000} seconds`)
  })
})()
