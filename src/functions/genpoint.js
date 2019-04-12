module.exports = () => {
  const min = 100
  const max = 300
  return Math.floor(Math.random() * (max + 1 - min)) + min
}
