module.exports = {
  regex: /^\/find_(\d{16})(?:@gowteambot)?/,
  callbackDataRegex: /^\/find_(\d{16}) (\d+)/,
  handler: async (context) => {
    const comparator = context.match[1]
    const page = parseInt(context.match[2], 10) || 1
    const offset = (page - 1) * 1

    const Team = require('../../../models/teams')

    const count = await Team.countDocuments().byUniqueComparator(comparator)

    const responseNotice = require('../../../utils/responseNotice')
    if (!count) return responseNotice(context, 'No data available.')

    const team = await Team.find().byUniqueComparator(comparator).skip(offset).then(teams => teams[0])

    const { getResponse } = require('../../teamcodeParser/helpers/index')
    const response = getResponse(context, team)

    const options = {
      parse_mode: 'HTML'
    }

    if (count > 1) {
      const inline_keyboard = []
      if (page > 1) inline_keyboard.push({ text: 'prev', callback_data: `/find_${comparator} ${page - 1}` })
      if (page < count) inline_keyboard.push({ text: 'next', callback_data: `/find_${comparator} ${page + 1}` })
      options.reply_markup = {
        inline_keyboard: [inline_keyboard]
      }
    }
    if (!context.callbackQuery) {
      return context.reply(response, options, {
        reply_to_message_id: context.message.message_id
      })
    }
    context.telegram.editMessageText(context.callbackQuery.message.chat.id, context.callbackQuery.message.message_id, null, response, options)
    context.telegram.answerCbQuery(context.callbackQuery.id)
  },
  attach: function (bot) {
    bot.hears(this.regex, this.handler)
    bot.action(this.callbackDataRegex, this.handler)
  }
}
