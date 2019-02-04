const fs = require('fs')
const util = require('../src/util')

const server_files = fs.readdirSync(__dirname + '/../data/servers')
const servers = server_files.map(e => `${__dirname}/../data/servers/${e}/config.json`)

servers.forEach(server => {
  const data = util.readJSONSync(server)
  if (typeof data.multipliers === 'undefined') data.multipliers = []
  util.writeJSONSync(server, data)
})
