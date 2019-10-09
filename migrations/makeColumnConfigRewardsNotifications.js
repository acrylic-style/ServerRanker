(async () => {
  const start = Date.now()
  const { LoggerFactory } = require('logger.js')
  const logger = LoggerFactory.getLogger('migrations:makeColumnConfigRewardsNotifications', 'green')
  const data = require('../src/data')
  process.once('dbready', async () => {
    logger.info('adding configRewardsNotifications column...')
    try { // eslint-disable-line no-restricted-syntax
      await data.query('alter table users add column configRewardsNotifications tinyint(1) default 0;')
    } catch (e) {
      logger.error('couldn\'t create column!')
      logger.error(e.stack || e)
    }
    logger.info(`done, took ${(Date.now()-start)/1000} seconds`)
    await data.disconnect()
  })
})()
