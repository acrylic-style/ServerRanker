require('./typedefs')

/**
 * @type {{ season1: SingleSeason, season2: SingleSeason }}
 */
const rewards = require('../rewards.yml')
const { battlepass: config } = require('../config.yml')
/**
 * @type {SingleSeason}
 */
const tierRewards = rewards[`season${config.season}`]

/**
 * Get all rewards.
 * @param {number} tier
 * @returns {{ normal: Array<Tiers>, premium: Array<Tiers> }}
 */
module.exports = tier => {
  if (typeof tier !== 'number') throw new TypeError('Tier should be number.')
  const normalRewards = []
  const premiumRewards = []
  for (let i = 0; i < tier; i++) {
    normalRewards.push(tierRewards.normal[`tier${i+1}`])
    premiumRewards.push(tierRewards.premium[`tier${i+1}`])
  }
  return { normal: normalRewards, premium: premiumRewards }
}
