const util = require('./util')
const mkdirp = require('mkdirp-promise')
const {
  defaultServer,
  defaultUser,
} = require('./defaults.json')
const path = {
  user: id => `${__dirname}/../data/users/${id}/config.json`,
  server: id => `${__dirname}/../data/servers/${id}/config.json`,
}

async function dataStore(id, type, _default) {
  console.log(require('./defaults.json'))
  if (id !== '') {
    if (type === 'user') await mkdirp(`${__dirname}/../data/users/${id}`)
    if (type === 'server') await mkdirp(`${__dirname}/../data/servers/${id}`)
  }
  const json = await util.readJSON(path[type](id), {})
  const data = Object.assign(_default, json[id])
  return {data, write: async settings => {
    await util.writeJSON(path[type](id), settings)
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
