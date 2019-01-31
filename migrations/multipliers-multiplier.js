const start = new Date().getTime()
console.log('Migration is now progress.\nIt may takes few minutes.')

const fs = require('fs')
const util = require('../src/util')

const users = []
const user_files = fs.readdirSync(__dirname + '/../data/users')
Promise.all(user_files.map(e => {
  users.push(`${__dirname}/../data/users/${e}/config.json`)
}))
users.forEach(user => {
  const data = util.readJSONSync(user)
  data.multipliers.forEach(multiplier => {
    if (multiplier.multiplier === 2) {
      multiplier.multiplier = 100
    }
  })
  util.writeJSONSync(user, data)
})
const end = new Date().getTime()
console.log(`Done in ${Math.round((end-start)/10)/100}s.`) // Done in 123.45s.
