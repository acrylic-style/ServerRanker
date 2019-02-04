const start = Date.now()
console.log('[User] Migration is now progress.\n[User] It may takes few minutes.')

const fs = require('fs')
const exists = path => {
  try { // eslint-disable-line
    fs.accessSync(path)
    return true
  } catch (err) {
    return false
  }
}

const user_files = fs.readdirSync(__dirname + '/../data/users')
const users = user_files.map(e => `${__dirname}/../data/users/${e}/config.json`)

users.forEach(user => {
  if (!exists(user)) {
    fs.unlinkSync(user.replace('/config.json', '/messages.log'))
    fs.rmdirSync(user.replace('/config.json', ''))
  }
})
const end = Date.now()
console.log(`[User] Done in ${Math.round((end - start) / 10) / 100}s.`) // Done in 123.45s.
