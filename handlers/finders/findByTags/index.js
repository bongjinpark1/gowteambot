module.exports = {
  regex: /^\/find (#.+)/,
  handler: async context => {
    let match
    const tags = []
    const regex = /(#(?:[ㄱ-힣]|\w)+)/g
    while ((match = regex.exec(context.match[1])) !== null) {
      tags.push(match[1])
    }

    const Team = require('../../../models/teams')
    const teams = await Team.findByTags(tags)
      .then(teams => {
        if (!teams || !teams.length) return null
        return teams.map(team => {
          let message = team.tags.join(' ')
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
