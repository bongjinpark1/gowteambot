module.exports = {
  regex: /^\/find (.+)/,
  callbackDataRegex: /find_(\d+) (.+)/,
  handler: async context => {
    const isCallback = !!context.callbackQuery
    const troopname = isCallback ? context.match[2] : context.match[1]
    const regex = new RegExp(troopname, 'i')

    const Team = require('../../../models/teams')

    const page = isCallback ? parseInt(context.match[1], 10) : 1

    const _options = {
      offset: (page - 1) * 1,
      limit: 5
    }

    console.log(_options)

    let total = 0

    const teams = await Team.findByTroopname(troopname, _options)
      .then(([teams, _total]) => {
        total = _total
        if (!teams || !teams.length) return null
        return teams.map(team => {
          let message = team.tags.join(' ')
          message += '\n' + team.troops.map(troop => {
            const name = troop.name
            if (name.match(regex)) return `<b>${name}</b>`
            return name
          }).join(' / ')
          message += '\n/find_' + team._id

          return message
        })
      })

    const responseNotice = require('../../../utils/responseNotice')
    if (!teams) return responseNotice(context, 'No data available.')

    const message = teams.join('\n\n')
    const options = {
      parse_mode: 'HTML'
    }

    const inline_keyboard = []
    if (page > 1) inline_keyboard.push({ text: 'prev', callback_data: `/find_${page - 1} ${troopname}` })
    if (page * _options.limit < total) inline_keyboard.push({ text: 'next', callback_data: `/find_${page + 1} ${troopname}` })
    options.reply_markup = {
      inline_keyboard: [inline_keyboard]
    }

    if (isCallback) {
      context.telegram.editMessageText(context.callbackQuery.message.chat.id, context.callbackQuery.message.message_id, null, message, options)
      context.telegram.answerCbQuery(context.callbackQuery.id)
    } else {
      options.reply_to_message_id = context.message.message_id
      context.reply(message, options)
    }
  },
  attach: function (bot) {
    bot.hears(this.regex, this.handler)
    bot.action(this.callbackDataRegex, this.handler)
  }
}
