require('./yaml')

const { Command } = require('bot-framework')
const Discord = require('discord.js')
const Logger = require('logger.js').LoggerFactory
const parser = require('minimist')
const language = require('./language')
const f = require('string-format')
const temp = require('./temp')
const data = require('./data')

const addpoint = require('./functions/addpoint')
const genpoint = require('./functions/genpoint')
const addexp = require('./functions/addexp')
const genexp = require('./functions/genexp')

module.exports = {
  Discord,
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
    addexp,
    genexp,
  },
  config: require('./config.yml'),
}
