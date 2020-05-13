// 引用 linebot 套件
import linebot from 'linebot'
// 引用 dotenv 套件
import dotenv from 'dotenv'
// 引用 request 套件
import rp from 'request-promise'

// 讀取 env 檔
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const optionToken = {
  method: 'POST',
  uri: 'https://account.kkbox.com/oauth2/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  form: {
    grant_type: 'client_credentials',
    client_id: process.env.KKBOX_ID,
    client_secret: process.env.KKBOX_SECRET
  },
  json: true
}
let token = ''

const getToken = async () => {
  try {
    const response = await rp(optionToken)
    token = response.access_token
  } catch (error) {
    console.log(error.message)
    console.log('false')
  }
}
// 時間差問題，console.log(token) 要等一下

getToken()

bot.on('message', async function (event) {
  const option = {
    uri: 'https://api.kkbox.com/v1.1/charts/chart_id',
    qs: {
      territory: 'TW'
    },
    auth: {
      bearer: token
    },
    json: true
  }
  class Leaderboard {
    constructor(id) {
      this.id = id
    }

    async info() {
      try {
        option.uri = 'https://api.kkbox.com/v1.1/charts/' + this.id
        const response = await rp(option)
        console.log(response)
      } catch (error) {
        console.log(error.msg)
      }
    }
  }
  // -------------------------------------------------------------------------------------------
  switch (event.message.text) {
    case '!綜合':
      const live = new Leaderboard('LZPhK2EyYzN15dU-PT')
      live.info()
      break
  }
})

// https://www.postman.com/collections/5cd6236e9e9748fd1ed1

// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
