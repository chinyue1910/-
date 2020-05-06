import linebot from 'linebot'
import dotenv from 'dotenv'
import YouTube from 'youtube-node'

dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const youTube = new YouTube()
youTube.setKey(process.env.API_KEY)

const test = async () => {
  await youTube.search('蔡阿嘎', 2, function (error, result) {
    if (error) {
      console.log(error)
    } else {
      console.log(JSON.stringify(result, null, 2))
    }
  })
}

test()

bot.listen('/', process.env.PORT, () => {
  console.log('已啟動')
})

// https://www.npmjs.com/package/youtube-node 套件用法
