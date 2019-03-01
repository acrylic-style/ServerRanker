import _fs = require('fs')
const fs = _fs.promises
import moment = require('moment')
import mkdirp = require('mkdirp-promise')

const getDateTime = () => moment().format('YYYY/MM/DD HH:mm:ss')
const path = {
  userMessages: authorID => `${__dirname}/../data/users/${authorID}/messages.log`,
  serverMessages: guildID => `${__dirname}/../data/servers/${guildID}/messages.log`,
  editUserMessages: authorID => `${__dirname}/../data/users/${authorID}/editedMessages.log`,
  editServerMessages: guildID => `${__dirname}/../data/servers/${guildID}/editedMessages.log`,
}

export = {
  async messageLog(msg) {
    await mkdirp(`${__dirname}/../data/users/${msg.author.id}`)
    !msg.guild || await mkdirp(`${__dirname}/../data/servers/${msg.guild.id}`)
    const parentName = msg.channel.parent ? msg.channel.parent.name : ''
    const log = `[${getDateTime()}::${msg.guild ? msg.guild.name : '(DM)'}:${parentName}:${msg.channel.name}:${msg.channel.id}:${msg.author.tag}:${msg.author.id}] ${msg.guild ? msg.content : '<censored>'}\n`
    fs.appendFile(path.userMessages(msg.author.id), log)
    !msg.guild || fs.appendFile(path.serverMessages(msg.guild.id), log)
  },
  async editedLog(old, msg) {
    await mkdirp(`${__dirname}/../data/users/${msg.author.id}`)
    !msg.guild || await mkdirp(`${__dirname}/../data/servers/${msg.guild.id}`)
    const parentName = msg.channel.parent ? msg.channel.parent.name : ''
    const log = `[${getDateTime()}::${msg.guild ? msg.guild.name : '(DM)'}:${parentName}:${msg.channel.name}:${msg.channel.id}:${msg.author.tag}:${msg.author.id}] ${old.guild ? old.content : '<censored>'}\n----------\n${msg.guild ? msg.content : '<censored>'}\n----------\n----------\n`
    fs.appendFile(path.editUserMessages(msg.author.id), log)
    !msg.guild || fs.appendFile(path.editServerMessages(msg.guild.id), log)
  },
}
