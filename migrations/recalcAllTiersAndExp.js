(async () => {
  const start = Date.now()
  const { LoggerFactory } = require('logger.js')
  const logger = LoggerFactory.getLogger('migrations:recalcAllTiersAndExp', 'green')
  const data = require('../src/data')
  const getTier = require('../src/functions/getTier')
  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }
  logger.info('first, we\'ll load all users.')
  const users = await data.getAllUsers()
  asyncForEach(users, async user => {
    logger.info('processing user: ' + user.user_id)
    await data.User.update({ exp: await data.calcWeightedExp(user.user_id) }, {
      where: { user_id: user.user_id },
    })
    await data.addUserBattlePassTier(user.user_id, getTier((await data.getUser(user.user_id)).exp))
  })
  logger.info('done. took ' + ((Date.now()-start)/1000) + ' seconds.')
})()
