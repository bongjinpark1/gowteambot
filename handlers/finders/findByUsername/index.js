module.exports = {
  regex: /^\/find @(\w+)/,
  handler: async context => {
    const username = context.match[1]

    const Team = require('../../../models/teams')
    const teams = await Team.findByUsername(username)
      .then(teams => {
        if (!teams || !teams.length) return null
        return teams.map(team => {
          let message = '@' + username
          message += ' ' + team.tags.join(' ')
          message += '\n' + team.troops.map(troop => troop.name).join(' / ')
          message += '\n/find_' + team._id

          return message
        })
      })

    const responseNotice = require('../../../utils/responseNotice')
    if (!teams) return responseNotice(context, 'No data available.')

    const queuedResponse = require('../../../utils/queuedReponse')
    queuedResponse(context, teams, {
      reply_to_message_id: context.message.message_id
    })
  },
  attach: function (bot) {
    bot.hears(this.regex, this.handler)
  }
}
