// 引用 linebot 套件
import linebot from 'linebot'
// 引用 dotenv 套件
import dotenv from 'dotenv'
// 引用 request 套件
import rp from 'request-promise'

import cheerio from 'cheerio'

// 讀取 env 檔
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// // 當收到訊息時
// bot.on('message', function (event) {
//   if (event.message.type === 'text') {
//     event.source.profile().then(function (profile) {
//       event.reply(profile.displayName + '你再說一次試試看')
//     })
//   }
// })

const test = async (event) => {
  let msg = ''
  try {
    const data = await rp('https://www.ptt.cc/bbs/Beauty/index.html')
    const $ = cheerio.load(data)
    console.log($('.title').eq(2).find('a'))
  } catch (error) {
    msg = '發生錯誤'
  }
}

test()

// bot.on('message', async (event) => {
//   let msg = ''
//   try {
//     const data = await rp('https://www.ptt.cc/bbs/Beauty/index.html')
//     const $ = cheerio.load(data)
//     console.log($('.r-ent'))
//   } catch (error) {
//     msg = '發生錯誤'
//   }
//   event.reply(msg)
// })

// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
