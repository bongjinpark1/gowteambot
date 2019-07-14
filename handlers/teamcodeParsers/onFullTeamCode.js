const reportError = require('../../utils/reportError')
const {
  getClassId,
  getKingdomId,
  getResponse,
  getTalentIndices,
  getTroopIds,
  findHeroClass,
  findKingdom,
  findTroops
} = require('./helpers')

module.exports = bot => {
  const regex = /^\[((?:\d{4},){4}\d{4}(?:,(?:(?:\d,){7})?\d{5})?)\](?:\s(.+))?/
  const handler = async (context) => {
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

    const options = {
      troops,
      kingdom,
      heroClass,
      talents,
      comment
    }

    const response = getResponse(context, codes, options)

    context.reply(response, {
      parse_mode: 'HTML'
    })
  }

  bot.hears(regex, handler)

  return {
    regex,
    handler
  }
}
