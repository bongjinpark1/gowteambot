require('dotenv').config()
const dbConnect = require('./dbConnect')
const bot = require('./bot')
const run = require('./runTelegramBot')

dbConnect(() => {
  run(bot)
})

// const { fork } = require('child_process')
// const path = require('path')

// let crawler

// function createCrawler () {
//   crawler = fork(path.join(__dirname, './clienCrawler.js'), {}, 5000)

//   crawler.on('exit', () => {
//     console.log('crawler exited.')
//     createCrawler()
//   })
// }

// createCrawler()
