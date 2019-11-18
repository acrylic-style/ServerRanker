const _ = require('../data')

module.exports = async (user_id, type, data) => {
  switch (type) {
    case 'pointboost':
      await _.updateUser(user_id, 'personal_pointboost', (await _.getUser(user_id)).personal_pointboost + data)
      break
    case 'multiplier':
      await _.addMultiplier(user_id, 100*data)
      break
  }
}
