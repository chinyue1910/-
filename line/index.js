import linebot from 'linebot'
import dotenv from 'dotenv'
import rp from 'request-promise'
import search from 'youtube-search'

dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const opts = {
  maxResults: 5,
  key: process.env.API_KEY
}

// const test = async () => {
//   let msg = ''
//   try {
//     await search('蔡阿嘎', opts, function (err, results) {
//       if (err) return console.log(err)
//       for (let i of results) {
//         console.dir(i.thumbnails.high.url)
//       }
//     })
//   } catch (error) {
//     msg = '錯誤'
//   }
//   console.log(msg)
// }

// test()

bot.on('message', async (event) => {
  let msg = ''
  try {
    await search('蔡阿嘎', opts, function (err, results) {
      if (err) { return console.log(err) }
      for (const i of results) {
        console.dir(i.thumbnails.high.url)
      }
      msg = results[0].thumbnails
    })
  } catch (error) {
    msg = '錯誤'
  }
  event.reply([
    {
      type: 'image',
      originalContentUrl: ,
      previewImageUrl: 'https://example.com/preview.jpg'
    }
  ])
})

bot.listen('/', process.env.PORT, () => {
  console.log('已啟動')
})
