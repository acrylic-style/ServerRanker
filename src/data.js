const { Logger, commons: { args: { args } } } = require('./server-ranker')
const logger = Logger.getLogger('db', 'purple')
logger.info('Connecting...')
const Sequelize = require('sequelize')
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
  prefix: {
    type: Sequelize.STRING,
    defaultValue: 'sr!',
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
  guild_id: {
    type: Sequelize.STRING,
  },
  user_id: {
    type: Sequelize.STRING,
  },
  multiplier: {
    type: Sequelize.INTEGER,
  },
  expires: {
    type: Sequelize.INTEGER,
  },
})
if (args.includes('forceSync')) logger.warn('Forced sync, it will drop table!!!')

sequelize.sync({ force: args.includes('forceSync') })

module.exports = {
  async data(serverId, userId) {
    return {
      server: { data: await Server.findByPk(serverId), write: async settings => { Server.upsert(settings); return await Server.findByPk(serverId) } },
      user: { data: await User.findByPk(userId), write: async settings => { User.upsert(settings); return await User.findByPk(userId) } },
      /*multipliers: {
        data: {
          server: await Multipliers.findAll(),
          user: await Multipliers.findById
        },
        write: {
          server: settings => { Multipliers.upsert(settings); Multipliers.findByPk(serverId) },
        },
      },*/
    }
  },
  async server(serverId) {
    return {
      server: { data: await Server.findByPk(serverId), write: settings => { Server.upsert(settings); return Server.findByPk(serverId) } } ,
      //multipliers: { data: { user: {}, server: await Multipliers.findById(serverId, { where: ['guild_id'] }) }, write: settings => Multipliers.upsert(settings) },
      user: { data: {}, write: () => true},
    }
  },
  async user(userId) {
    return {
      server: { data: {}, write: () => true},
      user: { data: await User.findByPk(userId), write: settings => { User.upsert(settings); return User.findByPk(userId) } },
      //multipliers: { data: { user: await Multipliers.findById(userId, { where: ['user_id'] }), server: {} }, write: settings => Multipliers.upsert(settings) },
    }
  },
}
