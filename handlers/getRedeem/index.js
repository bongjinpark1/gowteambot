const axios = require('axios')
const _ = require('lodash')
const Redeem = require('../../models/redeems')

module.exports = {
  regex: /^noti send ([a-zA-Z0-9]{10})$/i,
  handler: async function (context) {
    const url = 'https://pcmob.parse.gemsofwar.com/parse/functions/submit_code_web'
    const NameCode = process.env.INVITE_CODE
    const Code = context.match[1]

    const redeem = await Redeem.findOne({ code: Code })
    if (redeem) return

    const payload = {
      NameCode,
      Code
    }

    const res = await axios.post(url, payload)
    const success = _.get(res, 'data.result.success')

    if (!success) {
      let message = ''
      message += `input: ${Code}\n\n`
      message += `response: ${JSON.stringify(res.data)}`
      return context.telegram.sendMessage(process.env.ADMIN_CHAT_ID, message)
    }

    const _redeem = new Redeem({
      code: Code,
      username: context.message.from.username,
      first_name: context.message.from.first_name
    })

    try {
      await _redeem.save()
      let message = ''
      message += `input: ${Code}\n\n`
      message += `response: ${success}`
      context.telegram.sendMessage(process.env.ADMIN_CHAT_ID, message)
    } catch (err) {
      let message = ''
      message += `input: ${Code}\n\n`
      message += `response: ${JSON.stringify(res.data)}`
      context.telegram.sendMessage(process.env.ADMIN_CHAT_ID, message)
    }
  },
  attach: function (bot) {
    bot.hears(this.regex, this.handler)
  }
}
