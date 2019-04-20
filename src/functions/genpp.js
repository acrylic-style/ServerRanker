module.exports = msg => {
  const divby750 = msg.content.length / 750
  return Math.round(Math.min(300 * (divby750 - (/(\w)\1{10,}/g.test(msg.content) ? (divby750 / 4) : 0)), 200) * 100) / 100
}
