require('./yaml')

const Discord = require('discord.js')
const Resolver = require('./util/resolver')
const Logger = require('logger.js').LoggerFactory
const Command = require('./structures/Command')
const parser = require('minimist')
const language = require('./language')
const f = require('string-format')
const temp = require('./temp')
const data = require('./data')

const addpoint = require('./functions/addpoint')
const genpoint = require('./functions/genpoint')

module.exports = {
  Discord,
  Resolver,
  Logger,
  Command,
  commons: {
    args: parser(process.argv.slice(2)),
    language,
    f,
    temp,
    data,
  },
  functions: {
    addpoint,
    genpoint,
  },
  config: require('./config.yml'),
}
