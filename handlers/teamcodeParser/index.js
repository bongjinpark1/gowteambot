const reportError = require('../../utils/reportError')
const Jimp = require('jimp')
const {
  getClassId,
  getKingdomId,
  getResponse,
  getTalentIndices,
  getTroopIds,
  findHeroClass,
  findKingdom,
  findTroops,
  renderTeamImage
} = require('./helpers')

module.exports = {
  regex: /^\[((?:\d{4},){4}\d{4}(?:,(?:(?:\d,){7})?\d{5})?)\](?:\s((?:.|\s)+))?/,
  handler: async function (context) {
    const matched = context.match
    const codes = matched[1].split(',')
    const comment = matched[2] ? matched[2].trim() : null

    const troopIds = getTroopIds(codes)
    const kingdomId = getKingdomId(codes)
    const talents = getTalentIndices(codes)
    const classId = getClassId(codes)

    const promises = []

    promises.push(findTroops(troopIds)
      .then(({ troops, errors }) => {
        if (errors) {
          errors.forEach(err => reportError(context, err))
        }
        return troops
      }))

    promises.push(findKingdom(kingdomId)
      .then(({ kingdom, error }) => {
        if (error) reportError(context, error)
        return kingdom
      }))

    if (classId) {
      promises.push(findHeroClass(classId)
        .then(({ heroClass, error }) => {
          if (error) reportError(context, error)
          return heroClass
        }))
    }

    const [troops, kingdom, heroClass] = await Promise.all(promises)

    const Team = require('../../models/teams')
    const options = {
      troops,
      kingdom,
      username: context.message.from.username,
      first_name: context.message.from.first_name,
      chatId: context.message.chat.id,
      teamcode: ['[', codes.join(','), ']'].join('')
    }
    if (heroClass) options.heroClass = heroClass
    if (talents) options.talents = talents
    if (comment) options.comment = comment
    const team = new Team(options)

    await team.save()

    const response = getResponse(context, team.toObject())
    const image = await renderTeamImage(troops, kingdom).then(image => image.getBufferAsync(Jimp.MIME_JPEG))

    context.replyWithPhoto({ source: image }, {
      reply_to_message_id: context.message.message_id,
      caption: response,
      parse_mode: 'HTML'
    })
  },
  attach: function (bot) {
    bot.hears(this.regex, this.handler)
  }
}
