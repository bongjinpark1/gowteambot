require('dotenv').config()
const dbConnect = require('./dbConnect')
const bot = require('./bot')
const run = require('./runTelegramBot')

dbConnect(() => {
  run(bot)
})
