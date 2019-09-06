function getTroopIds (codes) {
  return codes.slice(0, 4).map(code => parseInt(code, 10))
}
function getKingdomId (codes) {
  return parseInt(codes[4], 10)
}
function getTalentIndices (codes) {
  const talents = codes.slice(5, 12)
  if (talents.length === 7 && talents.every(index => typeof index === 'string' && index.length === 1)) return talents.map(index => parseInt(index, 10))
  return null
}
function getClassId (codes) {
  if (codes[5] && codes[5].length === 5) return parseInt(codes[5], 10)
  else if (!codes[5]) return null
  return parseInt(codes[12], 10)
}
async function findTroops (troopIds) {
  const Card = require('../../../models/cards')
  const troops = []
  const errors = []
  const promises = troopIds.map((id, index) => {
    return Card.findById(id)
      .then(card => {
        if (!card) throw new Error(`Card ${id} not found.`)
        troops[index] = card
      })
      .catch(err => {
        troops[index] = { _id: id, name: 'Not found' }
        errors.push(err)
      })
  })

  await Promise.all(promises)

  return {
    troops,
    errors: errors.length ? errors : null
  }
}
function findKingdom (id) {
  const Kingdom = require('../../../models/kingdoms')

  return Kingdom.findById(id)
    .then(kingdom => {
      if (!kingdom) throw new Error(`Kingdom ${id} not found.`)
      return {
        kingdom,
        error: null
      }
    })
    .catch(err => {
      return {
        kingdom: { _id: id, name: 'Kingdom not found', bannerName: 'Banner not found' },
        error: err
      }
    })
}
function findHeroClass (id) {
  const Class = require('../../../models/classes')

  return Class.findById(id)
    .then(heroClass => {
      if (!heroClass) throw new Error(`Class ${id} not found.`)
      return {
        heroClass,
        error: null
      }
    })
    .catch(err => {
      return {
        heroClass: { _id: id, name: 'Class not found' },
        error: err
      }
    })
}
function getResponse (context, options = {}) {
  const { troops, kingdom, heroClass, talents, comment, _id, teamcode, first_name, createdAt } = options

  let response = ''
  response += `<b>${kingdom.bannerName}</b> (${kingdom.name})`
  if (heroClass) {
    response += '\n'
    response += `<b>${heroClass.name}</b> `
  }
  if (talents) {
    response += talents.map((i, index, arr) => {
      return index === arr.length - 1 ? i : `${i},`
    }).join('')
  }

  response += '\n\n'
  response += troops.map(troop => {
    return `<b>· ${troop.name}</b>\n`
  }).join('')
  response += '\n'
  response += `<code>${teamcode}</code>`

  if (comment) {
    response += '\n\n'
    response += comment.trim()
  }

  const username = first_name
  const date = require('moment')(createdAt).format('YYYY-MM-DD')
  response += `\n\n<b>No. ${_id}</b> from <b>${username} ${date}</b>`

  if (comment) {
    response += `\n<a href="http://gowclien.net/teams/${_id}">웹에서보기</a>`
  }

  return response
}

const renderTeamImage = require('./renderTeamImage')

module.exports = {
  getTroopIds,
  getKingdomId,
  getTalentIndices,
  getClassId,
  findTroops,
  findKingdom,
  findHeroClass,
  getResponse,
  renderTeamImage
}
