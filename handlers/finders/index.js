const findByTags = require('./findByTags')

module.exports = {
  attach: function (bot) {
    findByTags.attach(bot)
  }
}
