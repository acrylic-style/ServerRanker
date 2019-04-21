const data = require('../data')
const generate = require('./genexp.js')

module.exports = async msg => {
  if (!msg.guild) return
  await data.addUserexp(msg.author.id, generate(msg))
}
