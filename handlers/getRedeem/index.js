const axios = require('axios')
const received = []
module.exports = {
  regex: /^noti send (\w{10})$/i,
  handler: async function (context) {
    const url = 'https://pcmob.parse.gemsofwar.com/parse/functions/submit_code_web'
    const inviteCode = process.env.INVITE_CODE
    const redeem = context.match[1].toUpperCase()
    if (received.includes(redeem)) return
    received.push(redeem)
    const payload = {
      NameCode: inviteCode,
      Code: redeem
    }

    const res = await axios.post(url, payload)
    let message = ''
    message += `input: ${redeem}\n\n`
    message += `response: ${JSON.stringify(res.data)}`
    context.telegram.sendMessage(process.env.ADMIN_CHAT_ID, message)
  },
  attach: function (bot) {
    bot.hears(this.regex, this.handler)
  }
}
