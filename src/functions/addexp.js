const data = require('../data')
const generate = require('./genexp')
const giveReward = require('./giveReward')

module.exports = async msg => {
  if (!msg.guild) return
  const oldTier = (await data.getUser(msg.author.id)).bp_tier
  await data.addUserexp(msg.author.id, generate(msg))
  const tier = data.getTier((await data.getUser(msg.author.id)).exp)
  const rewardsa = []
  for (let i = oldTier; i < tier; i++) {
    const rewards = require('../rewards')
    const { battlepass: config } = require('../config.yml')
    const tierRewards = rewards[`season${config.currentSeason}`]
    const index = i+1
    if (tierRewards.normal[`tier${index}`]) {
      await giveReward(msg.author.id, tierRewards.normal[`tier${index}`].type, tierRewards.normal[`tier${index}`].data)
      rewardsa.push(tierRewards.normal[`tier${index}`].name)
    }
    if (await data.isPremium(msg.author.id) && tierRewards.premium[`tier${index}`]) {
      await giveReward(msg.author.id, tierRewards.premium[`tier${index}`].type, tierRewards.premium[`tier${index}`].data)
      rewardsa.push(tierRewards.premium[`tier${index}`].name)
    }
  }
  if (oldTier < tier) await msg.channel.send(msg.author.tag + ', You\'ve unlocked following rewards:\n' + rewardsa.join('\n')).catch(() => {})
}
