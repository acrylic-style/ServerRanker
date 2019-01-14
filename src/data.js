const util = require('./util')
const mkdirp = require('mkdirp-promise')
const fs = require('fs').promises
const {
  defaultServer,
  defaultUser,
} = require('./defaults.json')
//Object.freeze(defaultServer)
//Object.freeze(defaultUser)
const path = {
  user: id => `${__dirname}/../data/users/${id}/config.json`,
  server: id => `${__dirname}/../data/servers/${id}/config.json`,
}

async function dataStore(id, type, _default) {
  if (id !== '') {
    if (type === 'user') await mkdirp(`${__dirname}/../data/users/${id}`)
    if (type === 'server') await mkdirp(`${__dirname}/../data/servers/${id}`)
  }
  const json = await util.readJSON(path[type](id), {})
  const clonedDefault = JSON.parse(JSON.stringify(_default))
  const data = Object.assign(clonedDefault, json)
  return {data, write: async settings => {
    return await fs.writeFile(path[type](id), JSON.stringify(settings), 'utf8')
  }}
}

module.exports = {
  async data(serverId, userId) {
    return {
      server: await dataStore(serverId, 'server', defaultServer),
      user: await dataStore(userId, 'user', defaultUser),
    }
  },
  async server(serverId) {
    return {
      server: await dataStore(serverId, 'server', defaultServer),
      user: {},
    }
  },
  async user(userId) {
    return {
      server: {},
      user: await dataStore(userId, 'user', defaultUser),
    }
  },
}
