const start = Date.now()
console.log('Migration is now progress.\nIt may takes few minutes.')
require('../maintenance/remove-empty-folder')
const fs = require('fs')
const util = require('../src/util')

const user_files = fs.readdirSync(__dirname + '/../data/users')
const users = user_files.map(e => `${__dirname}/../data/users/${e}/config.json`)

users.forEach(user => {
  try { // eslint-disable-line
    const data = util.readJSONSync(user)
    if (typeof data.multipliers === 'undefined') data.multipliers = []
    data.multipliers.forEach(multiplier => {
      if (multiplier.multiplier === 2) {
        multiplier.multiplier = 100
      }
    })
    util.writeJSONSync(user, data)
  } catch(err) {
    fs.unlinkSync(user.replace('/config.json', ''))
  }
})
const end = Date.now()
console.log(`Done in ${Math.round((end - start) / 10) / 100}s.`) // Done in 123.45s.
