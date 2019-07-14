module.exports = {
  regex: /^\/iy (\d{4}) (\d{1,3})/,
  handler: async (context) => {
    const match = context.match
    const _id = parseInt(match[1], 10)
    const y = parseInt(match[2], 10)
    const Card = require('../../models/cards')

    const card = await Card.findById(_id)

    if (!card) return context.reply(`Card ${_id} not found.`)

    const renderTroopImage = require('../../utils/renderTroopImage')
    const Jimp = require('jimp')
    const image = await renderTroopImage(card, y).then(image => image.getBufferAsync(Jimp.MIME_JPEG))

    const sent = await context.replyWithPhoto({ source: image }, {
      caption: '1분후 만료됩니다. Y-Offset ' + y
    })

    setTimeout(() => {
      context.telegram.deleteMessage(sent.chat.id, sent.message_id)
      context.deleteMessage()
    }, 5000)
  },
  attach: function (bot) {
    bot.hears(this.regex, this.handler)
  }
}
