module.exports = msg => 
  Math.round(
    Math.min(
      300 * (
        msg.content.length / 750 - (
          /(\w)\1{10,}/g.test(msg.content) ? (msg.content.length / 750 / 4) : 0
        )
      ), 200
    ) * 100
  ) / 100
