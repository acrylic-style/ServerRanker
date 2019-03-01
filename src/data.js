const Logger = require('./util/logger')
const parser = require('./util/parser')
const { args } = parser(process.argv.slice(2))
const logger = Logger.getLogger('db', 'purple')
logger.info('Connecting...')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const config = require('./config.yml')
const sequelize = new Sequelize(config.database.name, config.database.user, config.database.pass, {
  host: 'localhost',
  dialect: config.database.type,
  storage: `${__dirname}/../data/database.sqlite`,
  operatorsAliases: false,
  logging: false,
})
sequelize.authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.')
  })
  .catch(err => {
    logger.emerg('Unable to connect to the database: ' + err)
    process.exit(1)
  })
const Server = sequelize.define('servers', {
  server_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  prefix: {
    type: Sequelize.STRING,
    defaultValue: config.prefix,
  },
  language: {
    type: Sequelize.STRING,
    defaultValue: 'en',
  },
  banned: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  point: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
})
const User = sequelize.define('users', {
  user_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  language: {
    type: Sequelize.STRING,
    defaultValue: null,
    allowNull: true,
  },
  banned: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  point: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  tag: {
    type: Sequelize.STRING,
    defaultValue: 'Unknown User#0000',
  },
})
const Multipliers = sequelize.define('multipliers', {
  multiplier_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  server_id: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  user_id: {
    type: Sequelize.STRING,
  },
  multiplier: {
    type: Sequelize.INTEGER,
  },
  expires: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
})
if (args.includes('forceSync')) logger.warn('Forced sync, it will drop table!!!')

sequelize.sync({ force: args.includes('forceSync') })

module.exports = {
  async getServer(server_id) {
    return (await Server.findOrCreate({
      where: { server_id },
      defaults: { server_id },
    }))[0]
  },
  async getUser(user_id) {
    return (await User.findOrCreate({
      where: { user_id },
      defaults: { user_id },
    }))[0]
  },
  updateUserTag(user_id, tag) {
    return User.update({ tag }, { where: { user_id } })
  },
  addServerPoint(server_id, point) {
    return Server.increment(['point'], {
      by: point,
      where: { server_id },
    })
  },
  addUserPoint(user_id, point) {
    return User.increment(['point'], {
      by: point,
      where: { user_id },
    })
  },
  subtractUserPoint(user_id, point) {
    return User.decrement(['point'], {
      by: point,
      where: { user_id },
    })
  },
  getServerLeaderboard() {
    return Server.findAll({
      attributes: ['server_id', 'point'],
      order: [['point', 'DESC']],
      limit: 5,
    })
  },
  getUserLeaderboard() {
    return User.findAll({
      attributes: ['user_id', 'point'],
      order: [['point', 'DESC']],
      limit: 5,
    })
  },
  getMultiplier(multiplier_id) {
    return Multipliers.findOne({
      where: { multiplier_id },
    })
  },
  getUserMultipliers(user_id) {
    return Multipliers.findAll({
      where: {
        user_id,
        server_id: null,
      },
    })
  },
  getServerMultipliers(server_id) {
    return Multipliers.findAll({
      where: {
        server_id,
        [Op.not]: { server_id: null },
      },
    })
  },
  addMultiplier(user_id, multiplier) {
    return Multipliers.create({ user_id, multiplier })
  },
  activateMultiplier(multiplier_id, server_id, expires) {
    return Multipliers.update({
      server_id, expires,
    }, {
      multiplier_id,
    })
  },
}
