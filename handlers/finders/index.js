const findByTags = require('./findByTags')
const findByUsername = require('./findByUsername')
const findByTroopname = require('./findByTroopname')

module.exports = {
  attach: function (bot) {
    findByTags.attach(bot)
    findByUsername.attach(bot)
    findByTroopname.attach(bot)
  }
}
