module.exports = function reportError (context, err) {
  const chatId = process.env.ADMIN_CHAT_ID
  const message = `error: ${err.message}\nfrom: ${context.from.first_name}\ninput: <code>${context.message.text}</code>`
  context.telegram.sendMessage(chatId, message, {
    parse_mode: 'HTML'
  })
}
