const axios = require('axios')
const cheerio = require('cheerio')
const Telegram = require('telegraf/telegram')

const telegram = new Telegram(process.env.BOT_TOKEN)
const world = -1001077486754

const http = axios.create({
  baseURL: 'https://www.clien.net/service/board/cm_gemwar'
})

let last = 14178205

function job () {
  http.get('/')
    .then((res) => {
      const $ = cheerio.load(res.data)

      const arr = $('body .nav_container .content_list .list_content .list_item').map((index, el) => {
        const key = $(el).attr('data-board-sn')
        const href = $(el).find('.list_title .list_subject').attr('href')

        return {
          key, href
        }
      }).get()

      arr.reverse().forEach(({ key, href }) => {
        console.log(key, href)
        if (!last || Number(last) < Number(key)) {
          telegram.sendMessage(world, 'https://www.clien.net' + href)
          last = key
        }
      })
    })
    .catch((err) => {
      console.error(err.message)
    })
}

setInterval(job, 1000 * 60)
