module.exports = async (context, message) => {
  const sent = await context.reply('Error: ' + message + ' Error message and command are expired in 1 minute.')
  setTimeout(() => {
    context.deleteMessage()
    context.telegram.deleteMessage(sent.chat.id, sent.message_id)
  }, 60000)
}
