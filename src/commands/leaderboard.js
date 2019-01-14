const { commons: { f }, Command, Discord } = require('../server-ranker')
const fs = require('fs').promises

module.exports = class extends Command {
  constructor() {
    super('leaderboard', { allowedIn: ['TextChannel'] })
  }

  async run(msg, settings, user, lang, args) {
    if (args[1] === 'server') {
      const servers = new Discord.Collection()
      const server_files = await fs.readdir(__dirname + '/../../data/servers')
      await Promise.all(server_files.map(async e => {
        servers.set(e, JSON.parse(await fs.readFile(`${__dirname}/../../data/servers/${e}/config.json`)).point)
      }))
      let s_points = Array.from(servers.sort().values())
      let s_ids = Array.from(servers.sort().keys())
      if (s_points.length !== 5) {s_points.unshift('0');s_points.unshift('0');s_points.unshift('0');s_points.unshift('0')}
      if (s_ids.length !== 5) {s_ids.unshift('0');s_ids.unshift('0');s_ids.unshift('0');s_ids.unshift('0')}
      s_points = s_points.slice(-5)
      s_ids = s_ids.slice(-5)
      const getServer = id => {
        return msg.client.guilds.has(id) ? msg.client.guilds.get(id).name : 'Unknown Server'
      }
      const embed = new Discord.RichEmbed()
        .setTimestamp()
        .setTitle('Leaderboard')
        .setDescription(f(lang.points, user.data.point.toLocaleString(), settings.data.point.toLocaleString(), Math.floor(Math.sqrt(4 + user.data.point/1000)-1), Math.floor(Math.sqrt(4 + settings.data.point/3000)-1)))
      if (s_points[4]) embed.addField(':first_place:', `${parseInt(s_points[4]).toLocaleString()} points (${getServer(s_ids[4])})`)
      if (s_points[3]) embed.addField(':second_place:', `${parseInt(s_points[3]).toLocaleString()} points (${getServer(s_ids[3])})`)
      if (s_points[2]) embed.addField(':third_place:', `${parseInt(s_points[2]).toLocaleString()} points (${getServer(s_ids[2])})`)
      if (s_points[1]) embed.addField('<:fourth_place:534409887027953694>', `${parseInt(s_points[1]).toLocaleString()} points (${getServer(s_ids[1])})`)
      if (s_points[0]) embed.addField('<:fifth_place:534410165169029120>', `${parseInt(s_points[0]).toLocaleString()} points (${getServer(s_ids[0])})`)
      msg.channel.send(embed)
    } else {
      const users = new Discord.Collection()
      const user_files = await fs.readdir(__dirname + '/../../data/users')
      await Promise.all(user_files.map(async e => {
        users.set(e, JSON.parse(await fs.readFile(`${__dirname}/../../data/users/${e}/config.json`)).point)
      }))
      let u_points = Array.from(users.sort().values()).slice(-5)
      let u_ids = Array.from(users.sort().keys()).slice(-5)
      if (u_points.length !== 5) {u_points.unshift('0');u_points.unshift('0');u_points.unshift('0');u_points.unshift('0')}
      if (u_ids.length !== 5) {u_ids.unshift('0');u_ids.unshift('0');u_ids.unshift('0');u_ids.unshift('0')}
      u_points = u_points.slice(-5)
      u_ids = u_ids.slice(-5)
      const getUser = id => {
        return msg.client.users.has(id) ? msg.client.users.get(id).username : 'Unknown User'
      }
      const embed = new Discord.RichEmbed()
        .setTimestamp()
        .setTitle('Leaderboard')
        .setDescription(f(lang.points, user.data.point.toLocaleString(), settings.data.point.toLocaleString(), Math.floor(Math.sqrt(4 + user.data.point/1000)-1), Math.floor(Math.sqrt(4 + settings.data.point/3000)-1)))
        .setFooter(`Want to see server leaderboard? Type \`${settings.data.prefix || 'sr!'}leaderboard server\``)
      if (u_points[4]) embed.addField(':first_place:', `${parseInt(u_points[4]).toLocaleString()} points (${getUser(u_ids[4])})`)
      if (u_points[3]) embed.addField(':second_place:', `${parseInt(u_points[3]).toLocaleString()} points (${getUser(u_ids[3])})`)
      if (u_points[2]) embed.addField(':third_place:', `${parseInt(u_points[2]).toLocaleString()} points (${getUser(u_ids[2])})`)
      if (u_points[1]) embed.addField('<:fourth_place:534409887027953694>', `${parseInt(u_points[1]).toLocaleString()} points (${getUser(u_ids[1])})`)
      if (u_points[0]) embed.addField('<:fifth_place:534410165169029120>', `${parseInt(u_points[0]).toLocaleString()} points (${getUser(u_ids[0])})`)
      msg.channel.send(embed)
    }
  }
}
