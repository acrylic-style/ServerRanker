const fs = require('fs')
const defaults = require('../src/defaults')
const util = require('../src/util')

const servers = []
const server_files = fs.readdirSync(__dirname + '/../data/servers')
Promise.all(server_files.map(e => {
  servers.push(`${__dirname}/../data/servers/${e}/config.json`)
}))
servers.forEach(server => {
  const data = util.readJSONSync(server)
  if (typeof data.multipliers === 'undefined') data.multipliers = []
  util.writeJSONSync(server, data)
})
