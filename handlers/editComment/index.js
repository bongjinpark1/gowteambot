module.exports = {
  regex: /^\/edit (\d{5}) (.+)/,
  handler: async (context) => {
    const match = context.match
    const _id = parseInt(match[1], 10)
    const comment = match[2]

    const responseError = require('../../utils/responseError')
    const responseNotice = require('../../utils/responseNotice')

    const Team = require('../../models/teams')
    const team = await Team.findById(_id)

    if (!team) return responseError(context, `Team no.${_id} not found.`)
    if (team.username !== context.from.username) return responseError(context, 'Only the author can edit the comment.')

    team.set('comment', comment)
    await team.save()

    responseNotice(context, 'Edit comment successful.')
  },
  attach: function (bot) {
    bot.hears(this.regex, this.handler)
  }
}
