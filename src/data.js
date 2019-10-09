require('./yaml')
const Logger = require('logger.js').LoggerFactory
const args = require('minimist')(process.argv.slice(2))
const logger = Logger.getLogger('db', 'purple')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const config = require('./config.yml')
logger.info(`Connecting to the database using ${config.database.type}...`)
const sequelize = new Sequelize.Sequelize(config.database.name, config.database.user, config.database.pass, {
  host: 'localhost',
  dialect: config.database.type,
  storage: `${__dirname}/../data/database.sqlite`,
  logging: false,
})
sequelize.authenticate()
  .then(() => {
    logger.info(`Connection has been established successfully. (Type: ${sequelize.getDialect()})`)
    process.emit('dbready')
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
  rawexp: { // unweighted exp
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  exp: { // weighted exp
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  bp_tier: { // battle pass tier
    type: Sequelize.INTEGER,
    defaultValue: 1, // tier 0 is impossible
  },
  personal_pointboost: {
    type: Sequelize.INTEGER,
    defaultValue: 0, // +n% personal exp boost, you can get from battle pass rewards
  },
  premium: { // BattlePass Premium State
    type: Sequelize.BOOLEAN,
    defaultValue: false,
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
  },
  user_id: {
    type: Sequelize.STRING,
  },
  multiplier: {
    type: Sequelize.INTEGER,
    defaultValue: 100,
  },
  expires: {
    type: Sequelize.DATE,
  },
})
const Exps = sequelize.define('exps', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.STRING,
  },
  exp: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
})
if (args.forceSync) logger.warn('Forced sync, it will drop table!!!')

sequelize.sync({ force: args.forceSync })

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
  setPremiumState(user_id, premium) {
    return User.update({ premium }, { where: { user_id } })
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
  async setUserBattlePassTier(user_id, tier) {
    if (tier === 100) return false
    return await User.update({ bp_tier: tier }, { where: { user_id } })
  },
  async addUserexp(user_id, exp) {
    await Exps.create({ user_id, exp })
    await User.increment(['rawexp'], {
      by: exp,
      where: { user_id },
    })
    await User.update({ exp: await this.calcWeightedExp(user_id) }, {
      where: { user_id },
    })
    await this.setUserBattlePassTier(user_id, this.getTier((await this.getUser(user_id)).exp))
    return await this.getUser(user_id)
  },
  async calcWeightedExp(user_id) {
    const allExps = await Exps.findAll({
      where: { user_id },
      attributes: ['exp'],
      order: [['exp', 'DESC']],
      limit: 100,
    })
    if (allExps.length <= 0) return 0
    return allExps.map((model, i) => model.exp * (100 - i) / 100).reduce((a , b) => a + b)
  },
  setServerPoint(user_id, point) {
    return Server.update(['point'], {
      by: point,
      where: { user_id },
    })
  },
  setUserPoint(user_id, point) {
    return User.update(['point'], {
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
  getexpUserLeaderboard() {
    return User.findAll({
      attributes: ['user_id', 'exp'],
      order: [['exp', 'DESC']],
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
  getActivatedMultipliers(server_id) {
    return Multipliers.findAll({
      where: {
        server_id,
        expires: {
          [Op.not]: null,
          [Op.gte]: Date.now(),
        },
      },
    })
  },
  countUserMultipliers(user_id) {
    return Multipliers.count({
      where: {
        user_id,
        server_id: null,
      },
    })
  },
  countActivatedMultipliers(server_id) {
    return Multipliers.count({
      where: {
        server_id,
        expires: {
          [Op.not]: null,
          [Op.gte]: Date.now(),
        },
      },
    })
  },
  async activatedMultipliers(server_id) {
    const multipliers = await Multipliers.findAll({ where: { server_id, expires: { [Op.not]: null, [Op.gte]: Date.now() } } })
    return multipliers.reduce(({multiplier: a}, {multiplier: b}) => a + b)/100
  },
  addMultiplier(user_id, multiplier) {
    return Multipliers.create({ user_id, multiplier })
  },
  activateMultiplier(multiplier_id, server_id, expires) {
    return Multipliers.update({
      server_id, expires,
    }, {
      where: { multiplier_id },
    })
  },
  getUsers(options) {
    return User.findAll(options)
  },
  getAllExps() {
    return Exps.findAll()
  },
  query(sql) {
    return sequelize.query(sql)
  },
  disconnect() {
    return sequelize.close()
  },
  async isPremium(user_id) {
    return (await this.getUser(user_id)).premium
  },
  updateUser(user_id, key, value) {
    return User.update({ [key]: value }, { where: { user_id } })
  },
  User,
  Server,
  Multipliers,
  Exps,
  Op,
  getTier: require('./functions/getTier'),
}
