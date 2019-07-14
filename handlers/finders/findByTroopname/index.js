module.exports = {
  regex: /^\/find (.+)/,
  handler: async context => {
    const troopname = context.match[1]
    const regex = new RegExp(troopname, 'i')

    const Team = require('../../../models/teams')
    const teams = await Team.findByTroopname(troopname)
      .then(teams => {
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

    const queuedResponse = require('../../../utils/queuedReponse')
    queuedResponse(context, teams, {
      parse_mode: 'HTML'
    })
  },
  attach: function (bot) {
    bot.hears(this.regex, this.handler)
  }
}
