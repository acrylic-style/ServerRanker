const start = Date.now()
console.log('[Server] Migration is now progress.\n[Server] It may takes few minutes.')

const fs = require('fs')
const exists = path => {
  try { // eslint-disable-line
    fs.accessSync(path)
    return true
  } catch (err) {
    return false
  }
}

const servers = []
const server_files = fs.readdirSync(__dirname + '/../data/servers')
server_files.map(e => {
  servers.push(`${__dirname}/../data/servers/${e}/config.json`)
})
servers.forEach(server => {
  if (!exists(server)) {
    fs.unlinkSync(server.replace('/config.json', '/messages.log'))
    fs.rmdirSync(server.replace('/config.json', ''))
  }
})
const end = Date.now()
console.log(`[Server] Done in ${Math.round((end - start) / 10) / 100}s.`) // Done in 123.45s.
