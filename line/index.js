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
  maxResults: 10,
  key: process.env.API_KEY
}

const test = async () => {
  let msg = ''
  try {
    await search('jsconf', opts, function (err, results) {
      if (err) return console.log(err)
      console.dir(results)
    })
  } catch (error) {
    msg = '錯誤'
  }
  console.log(msg)
}

test()

bot.on('message', async (event) => {
  let msg = ''
  try {
    const data = await rp({ uri: 'https://kktix.com/events.json', json: true })
    msg = data.entry[0].title
  } catch (error) {
    msg = '錯誤'
  }
  event.reply(msg)
})

bot.listen('/', process.env.PORT, () => {
  console.log('已啟動')
})
