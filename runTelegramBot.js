const teamcodeParser = require('./handlers/teamcodeParser')
const setImageYOffset = require('./handlers/setImageYOffset')
const editComment = require('./handlers/editComment')
module.exports = (bot) => {
  bot.use((ctx, next) => {
    const start = new Date()
    return next(ctx).then(() => {
      const ms = new Date() - start
      console.log('Response time %sms', ms)
    })
  })
  teamcodeParser.attach(bot)
  setImageYOffset.attach(bot)
  editComment.attach(bot)
  bot.launch()
  console.log('Bot running...')
}
