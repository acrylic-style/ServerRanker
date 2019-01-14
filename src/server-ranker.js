require('./yaml')

const Discord = require('discord.js')
const Resolver = require('./util/resolver')
const Logger = require('./util/logger')
const Command = require('./structures/Command')

const parser = require('./util/parser')
const language = require('./language')
const f = require('string-format')
const temp = require('./temp')

const addpoint = require('./functions/addpoint')

module.exports = {
  Discord,
  Resolver,
  Logger,
  Command,
  commons: {
    parser,
    language,
    f,
    temp,
  },
  functions: {
    addpoint,
  },
  config: require('./config.yml'),
}