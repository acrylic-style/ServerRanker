import Discord = require('discord.js')
import Resolver = require('./util/resolver')
import Logger = require('./util/logger')
import Command = require('./structures/Command')

import parser = require('./util/parser')
import language = require('./language')
import f = require('string-format')
import temp = require('./temp')
import data = require('./data')
import yaml = require('./yaml')

import addpoint = require('./functions/addpoint')

export = {
  Discord,
  Resolver,
  Logger,
  Command,
  commons: {
    args: parser(process.argv.slice(2)),
    parser,
    language,
    f,
    temp,
    data,
  },
  functions: {
    addpoint,
  },
  config: yaml.readYAMLSync('./config.yml'),
}
