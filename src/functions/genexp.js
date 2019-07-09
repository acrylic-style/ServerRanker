module.exports = msg => {
  const divby750 = msg.content.length / 750
  const deduct = /(\w)\1{10,}/g.test(msg.content) ? divby750 / 4 : 0
  return Math.min(300 * (divby750 - deduct), 200).toFixed(2)
}
