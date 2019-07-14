const onFullTeamCode = require('./handlers/teamcodeParsers/onFullTeamCode')
module.exports = (bot) => {
  bot.use((ctx, next) => {
    const start = new Date()
    return next(ctx).then(() => {
      const ms = new Date() - start
      console.log('Response time %sms', ms)
    })
  })
  onFullTeamCode(bot)
  bot.launch()
  console.log('Bot running...')
}
