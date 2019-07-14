const findByTags = require('./findByTags')
const findByUsername = require('./findByUsername')
const findByTroopname = require('./findByTroopname')
const findByUniqueComparator = require('./findByUniqueComparator')

module.exports = {
  attach: function (bot) {
    findByTags.attach(bot)
    findByUsername.attach(bot)
    findByTroopname.attach(bot)
    findByUniqueComparator.attach(bot)
  }
}
