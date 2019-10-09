const data = require('../data')
const generate = require('./genexp')
const giveReward = require('./giveReward')

module.exports = async msg => {
  if (!msg.guild) return
  const tier = data.getTier((await this.getUser(msg.author.id)).exp)
  const oldTier = (await data.getUser(msg.author.id)).bp_tier
  const rewardsa = []
  for (let i = oldTier; i < tier; i++) {
    const rewards = require('../rewards.yml')
    const { battlepass: config } = require('../config.yml')
    const tierRewards = rewards[`season${config.season}`]
    const index = i+1
    await giveReward(msg.author.id, tierRewards.normal[`tier${index}`].type, tierRewards.normal[`tier${index}`].data)
    rewardsa.push(tierRewards.normal[`tier${index}`].name)
    if (await data.isPremium(msg.author.id)) {
      await giveReward(msg.author.id, tierRewards.premium[`tier${index}`].type, tierRewards.premium[`tier${index}`].data)
      rewardsa.push(tierRewards.premium[`tier${index}`].name)
    }
  }
  if (oldTier < tier) msg.reply('You\'ve unlocked following rewards:\n' + rewardsa.join('\n'))
  await data.addUserexp(msg.author.id, generate(msg))
}
