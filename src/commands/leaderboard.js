const { commons: { f }, Command, Discord } = require('../server-ranker')
const data = require('../data')

module.exports = class extends Command {
  constructor() {
    super('leaderboard', { allowedIn: ['TextChannel'], args: ['[exp]', '[server]'] })
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
      let users
      let str = 'points'
      let property = 'point'
      let div = 1000
      let langproperty = 'points'
      if (args.includes('exp')) {
        users = await data.getexpUserLeaderboard()
        str = 'exp'
        property = 'exp'
        langproperty = 'exp'
        div = 2
      } else {
        users = await data.getUserLeaderboard()
      }
      const getUser = async id => (await msg.client.fetchUser(id)).tag
      const embed = new Discord.RichEmbed()
        .setTimestamp()
        .setColor([0,255,0])
        .setTitle('Leaderboard')
        .setDescription(f(lang.points, user.point.toLocaleString(), server.point.toLocaleString(), Math.floor(Math.sqrt(4 + user.point/1000)-1), Math.floor(Math.sqrt(4 + server.point/3000)-1)))
        .setFooter(`Want to see server leaderboard? Type \`${server.prefix || 'sr!'}leaderboard server\``)
      if (users[0]) embed.addField(':first_place:', `${parseInt(users[0][property]).toLocaleString()} ${str} (${await getUser(users[0].user_id)})`)
      if (users[1]) embed.addField(':second_place:', `${parseInt(users[1][property]).toLocaleString()} ${str} (${await getUser(users[1].user_id)})`)
      if (users[2]) embed.addField(':third_place:', `${parseInt(users[2][property]).toLocaleString()} ${str} (${await getUser(users[2].user_id)})`)
      if (users[3]) embed.addField('<:fourth_place:534409887027953694>', `${parseInt(users[3][property]).toLocaleString()} ${str} (${await getUser(users[3].user_id)})`)
      if (users[4]) embed.addField('<:fifth_place:534410165169029120>', `${parseInt(users[4][property]).toLocaleString()} ${str} (${await getUser(users[4].user_id)})`)
      if (args.includes('exp')) embed.setDescription(f(lang[langproperty], user[property].toLocaleString(), Math.floor(Math.sqrt(4 + user[property]/div)-1)))
      msg.channel.send(embed)
    }
  }
}
