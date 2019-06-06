require('./typedefs')

/**
 * @type {{ season1: SingleSeason }}
 */
const rewards = require('../rewards.yml')
const { battlepass: config } = require('../config.yml')
/**
 * @type {SingleSeason}
 */
const tierRewards = rewards[`season${config.season}`]
const { normal: normalTierRewards, premium: premiumTierRewards } = tierRewards

/**
 * @param {number} tier
 */
module.exports = tier => {
  if (typeof tier !== 'number') throw new TypeError('Tier should be number.')
  const array = new Array(tier)
  array.forEach((_, i) => {
  })
}
