const start = new Date().getTime()
console.log('[User] Migration is now progress.\n[User] It may takes few minutes.')

const fs = require('fs')
const exists = path => {
  try {
    fs.accessSync(path)
    return true
  } catch (err) {
    return false
  }
}

const users = []
const user_files = fs.readdirSync(__dirname + '/../data/users')
user_files.map(e => {
  users.push(`${__dirname}/../data/users/${e}/config.json`)
})
users.forEach(user => {
  if (!exists(user)) fs.rmdirSync(user.replace('/config.json', ''))
})
const end = new Date().getTime()
console.log(`[User] Done in ${Math.round((end - start) / 10) / 100}s.`) // Done in 123.45s.
