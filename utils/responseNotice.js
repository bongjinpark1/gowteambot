module.exports = async (context, message) => {
  const sent = await context.reply(message + ' This message and command are expired in 1 minute.', {
    reply_to_message_id: context.message.message_id
  })
  setTimeout(() => {
    context.deleteMessage()
    context.telegram.deleteMessage(sent.chat.id, sent.message_id)
  }, 60000)
}
