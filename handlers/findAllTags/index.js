module.exports = {
  regex: /^\/tags/,
  handler: async (context) => {
    const Team = require('../../models/teams')

    const message = await Team.findAllTags().then(tags => tags.join(' '))

    const options = {
      reply_to_message_id: context.message.message_id
    }
    const sent = await context.reply(message, options)
  },
  attach (bot) {
    bot.hears(this.regex, this.handler)
  }
}
