(async () => {
  const { LoggerFactory } = require('logger.js')
  const logger = LoggerFactory.getLogger('migrations:recalcAllTiersAndExp')
  const data = require('../src/data')
  const getTier = require('../src/functions/getTier')
  logger.info('first, we\'ll load all users.')
  const users = await data.getAllUsers()
  users.forEach(async user => {
    logger.info('processing user: ' + user.user_id)
    data.User.update({ exp: await this.calcWeightedExp(user.user_id) }, {
      where: { user_id: user.user_id },
    })
    await data.addUserBattlePassTier(user.user_id, getTier((await data.getUser(user.user_id)).exp))
  })
})()
