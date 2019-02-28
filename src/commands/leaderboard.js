const { commons: { f }, Command, Discord } = require('../server-ranker')
const data = require('../data')

module.exports = class extends Command {
  constructor() {
    super('leaderboard', { allowedIn: ['TextChannel'] })
  }

  async run(msg, lang, args) {
    const server = await data.getServer(msg.guild.id)
    const user = await data.getUser(msg.author.id)
    if (args[1] === 'server') {
      const servers = await data.getServerLeaderboard()
      const getServer = id => {
        return msg.client.guilds.has(id) ? msg.client.guilds.get(id).name : 'Unknown Server'
      }
      const embed = new Discord.RichEmbed()
        .setTimestamp()
        .setColor([0,255,0])
        .setTitle('Leaderboard')
        .setDescription(f(lang.points, user.point.toLocaleString(), server.point.toLocaleString(), Math.floor(Math.sqrt(4 + user.point/1000)-1), Math.floor(Math.sqrt(4 + server.point/3000)-1)))
      if (servers[0]) embed.addField(':first_place:', `${parseInt(servers[0].point).toLocaleString()} points (${getServer(servers[0].server_id)})`)
      if (servers[1]) embed.addField(':second_place:', `${parseInt(servers[1].point).toLocaleString()} points (${getServer(servers[1].server_id)})`)
      if (servers[2]) embed.addField(':third_place:', `${parseInt(servers[2].point).toLocaleString()} points (${getServer(servers[2].server_id)})`)
      if (servers[3]) embed.addField('<:fourth_place:534409887027953694>', `${parseInt(servers[3].point).toLocaleString()} points (${getServer(servers[3].server_id)})`)
      if (servers[4]) embed.addField('<:fifth_place:534410165169029120>', `${parseInt(servers[4].point).toLocaleString()} points (${getServer(servers[4].server_id)})`)
      embed.setFooter('https://server-ranker.ga/leaderboard/server')
      msg.channel.send(embed)
    } else {
      const users = await data.getUserLeaderboard()
      const getUser = id => {
        return msg.client.users.has(id) ? msg.client.users.get(id).username : 'Unknown User'
      }
      const embed = new Discord.RichEmbed()
        .setTimestamp()
        .setColor([0,255,0])
        .setTitle('Leaderboard')
        .setDescription(f(lang.points, user.point.toLocaleString(), server.point.toLocaleString(), Math.floor(Math.sqrt(4 + user.point/1000)-1), Math.floor(Math.sqrt(4 + server.point/3000)-1)))
        .setFooter(`Want to see server leaderboard? Type \`${server.prefix || 'sr!'}leaderboard server\``)
      if (users[0]) embed.addField(':first_place:', `${parseInt(users[0].point).toLocaleString()} points (${getUser(users[0].users_id)})`)
      if (users[1]) embed.addField(':second_place:', `${parseInt(users[1].point).toLocaleString()} points (${getUser(users[1].users_id)})`)
      if (users[2]) embed.addField(':third_place:', `${parseInt(users[2].point).toLocaleString()} points (${getUser(users[2].users_id)})`)
      if (users[3]) embed.addField('<:fourth_place:534409887027953694>', `${parseInt(users[3].point).toLocaleString()} points (${getUser(users[3].users_id)})`)
      if (users[4]) embed.addField('<:fifth_place:534410165169029120>', `${parseInt(users[4].point).toLocaleString()} points (${getUser(users[4].users_id)})`)
      msg.channel.send(embed)
    }
  }
}
