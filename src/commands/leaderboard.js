const { commons: { f }, Command, Discord } = require('../server-ranker')
const fs = require('fs').promises
const util = require('../util')
const data = require('../data')

module.exports = class extends Command {
  constructor() {
    super('leaderboard', { allowedIn: ['TextChannel'] })
  }

  async run(msg, lang, args) {
    const server = await data.getServer(msg.guild.id)
    const user = await data.getUser(msg.author.id)
    if (args[1] === 'server') {
      const servers = new Discord.Collection((await data.getLeaderboard()).map(server => [server.server_id, server.point]))
      const s_points = Array.from(servers.sort().values()).slice(-5).reverse()
      const s_ids = Array.from(servers.sort().keys()).slice(-5).reverse()
      const getServer = id => {
        return msg.client.guilds.has(id) ? msg.client.guilds.get(id).name : 'Unknown Server'
      }
      const embed = new Discord.RichEmbed()
        .setTimestamp()
        .setColor([0,255,0])
        .setTitle('Leaderboard')
        .setDescription(f(lang.points, user.point.toLocaleString(), server.point.toLocaleString(), Math.floor(Math.sqrt(4 + user.point/1000)-1), Math.floor(Math.sqrt(4 + server.point/3000)-1)))
      if (s_points[0]) embed.addField(':first_place:', `${parseInt(s_points[0]).toLocaleString()} points (${getServer(s_ids[0])})`)
      if (s_points[1]) embed.addField(':second_place:', `${parseInt(s_points[1]).toLocaleString()} points (${getServer(s_ids[1])})`)
      if (s_points[2]) embed.addField(':third_place:', `${parseInt(s_points[2]).toLocaleString()} points (${getServer(s_ids[2])})`)
      if (s_points[3]) embed.addField('<:fourth_place:534409887027953694>', `${parseInt(s_points[3]).toLocaleString()} points (${getServer(s_ids[3])})`)
      if (s_points[4]) embed.addField('<:fifth_place:534410165169029120>', `${parseInt(s_points[4]).toLocaleString()} points (${getServer(s_ids[4])})`)
      embed.setFooter('https://server-ranker.ga/leaderboard/server')
      msg.channel.send(embed)
    } else {
      const user_files = await fs.readdir(__dirname + '/../../data/users')
      const users = new Discord.Collection((await Promise.all(user_files.map(async e =>
        util.exists(`${__dirname}/../../data/users/${e}/config.json`)
          ? [e, JSON.parse(await fs.readFile(`${__dirname}/../../data/users/${e}/config.json`)).point]
          : null // don't do anything
      ))).filter(e => e))
      const u_points = Array.from(users.sort().values()).slice(-5).reverse()
      const u_ids = Array.from(users.sort().keys()).slice(-5).reverse()
      const getUser = id => {
        return msg.client.users.has(id) ? msg.client.users.get(id).username : 'Unknown User'
      }
      const embed = new Discord.RichEmbed()
        .setTimestamp()
        .setColor([0,255,0])
        .setTitle('Leaderboard')
        .setDescription(f(lang.points, user.point.toLocaleString(), server.point.toLocaleString(), Math.floor(Math.sqrt(4 + user.point/1000)-1), Math.floor(Math.sqrt(4 + server.point/3000)-1)))
        .setFooter(`Want to see server leaderboard? Type \`${server.prefix || 'sr!'}leaderboard server\``)
      if (u_points[0]) embed.addField(':first_place:', `${parseInt(u_points[0]).toLocaleString()} points (${getUser(u_ids[0])})`)
      if (u_points[1]) embed.addField(':second_place:', `${parseInt(u_points[1]).toLocaleString()} points (${getUser(u_ids[1])})`)
      if (u_points[2]) embed.addField(':third_place:', `${parseInt(u_points[2]).toLocaleString()} points (${getUser(u_ids[2])})`)
      if (u_points[3]) embed.addField('<:fourth_place:534409887027953694>', `${parseInt(u_points[3]).toLocaleString()} points (${getUser(u_ids[3])})`)
      if (u_points[4]) embed.addField('<:fifth_place:534410165169029120>', `${parseInt(u_points[4]).toLocaleString()} points (${getUser(u_ids[4])})`)
      msg.channel.send(embed)
    }
  }
}
