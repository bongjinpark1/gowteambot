const teamcodeParser = require('./handlers/teamcodeParser')
const setImageYOffset = require('./handlers/setImageYOffset')
const editComment = require('./handlers/editComment')
const finders = require('./handlers/finders')
module.exports = (bot) => {
  bot.use((ctx, next) => {
    const start = new Date()
    if (!ctx.match) return next()
    return next(ctx).then(() => {
      if (!ctx.update.callback_query) {
        const ms = new Date() - start
        const from = ctx.update.message.from.first_name
        const input = ctx.update.message.text
        let message = ''
        message += `from: ${from}\n`
        message += `input: ${input}\n`
        message += `latancy: ${ms} ms`
        ctx.telegram.sendMessage(process.env.ADMIN_CHAT_ID, message)
      }
    })
  })
  teamcodeParser.attach(bot)
  setImageYOffset.attach(bot)
  editComment.attach(bot)
  finders.attach(bot)
  bot.command('help', (context) => {
    let message = ''
    message += '[teamcode] 팀코드를 해독하여 출력합니다.\n\n'
    message += '/find #hashtag, @username, troopname 으로 팀을 검색합니다. 코멘트가 없는 팀은 검색되지 않습니다.\n\n'
    message += '/ec [nnnnn] [comment] 내가 포스팅한 팀의 코멘트를 덮어씁니다.\n\n'
    message += '/iy [cardId] [number] 카드 이미지의 y 오프셋을 변경합니다. 기본값 100에서 작아지면 올라가고, 커지면 내려갑니다.\n\n'

    context.reply(message)
  })
  bot.launch()
  console.log('Bot running...')
}
