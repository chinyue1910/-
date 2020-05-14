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
  // 歌曲物件導向--------------------------------------------------------------------------------------
  class LeaderboardTrack {
    constructor(id) {
      this.id = id
      this.ary = []
      this.option = {
        uri: 'https://api.kkbox.com/v1.1/charts/chart_id/tracks',
        qs: {
          territory: 'TW',
          limit: 10
        },
        auth: {
          bearer: token
        },
        json: true
      }
    }

    async info() {
      try {
        this.option.uri = 'https://api.kkbox.com/v1.1/charts/' + this.id + '/tracks'
        const response = await rp(this.option)
        for (const i of response.data) {
          this.ary.push(
            {
              thumbnailImageUrl: i.album.images[0].url,
              title: i.name,
              text: i.album.artist.name,
              actions: [{
                type: 'postback',
                label: '立即試聽',
                data: 'action=add&itemid=111'
              }, {
                type: 'uri',
                label: '看看歌詞',
                uri: i.url
              }]
            }
          )
        }
        event.reply({
          type: 'template',
          altText: 'this is a carousel template',
          template: {
            type: 'carousel',
            columns: this.ary
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
  // 排行榜物件導向--------------------------------------------------------------------------------------
  class Leaderboard {
    constructor(id) {
      this.id = id
      this.ary = []
      this.option = {
        uri: 'https://api.kkbox.com/v1.1/charts/chart_id/tracks',
        qs: {
          territory: 'TW',
          limit: 10
        },
        auth: {
          bearer: token
        },
        json: true
      }
    }

    async info() {
      try {
        this.option.uri = 'https://api.kkbox.com/v1.1/charts/' + this.id + '/tracks'
        const response = await rp(this.option)
        for (const i of response.data) {
          this.ary.push(
            {
              thumbnailImageUrl: i.album.images[0].url,
              title: i.name,
              text: i.album.artist.name,
              actions: [{
                type: 'postback',
                label: '立即試聽',
                data: 'action=add&itemid=111'
              }, {
                type: 'uri',
                label: '看看歌詞',
                uri: i.url
              }]
            }
          )
        }
        event.reply({
          type: 'template',
          altText: 'this is a carousel template',
          template: {
            type: 'carousel',
            columns: this.ary
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  // -------------------------------------------------------------------------------------------
  switch (event.message.text) {
    case '!綜合':
      const l1 = new LeaderboardTrack('LZPhK2EyYzN15dU-PT')
      l1.info()
      break
    case '!華語':
      const l2 = new LeaderboardTrack('Ct1lsavgcKhiQMGmkH')
      l2.info()
      break
    case '!西洋':
      const l3 = new LeaderboardTrack('4poDBNQIFJSONTfzD_')
      l3.info()
      break
    case '!韓語':
      const l4 = new LeaderboardTrack('9XrDk_NiUFThN_-nfZ')
      l4.info()
      break
    case '!日語':
      const l5 = new LeaderboardTrack('D_KBTe8Cdcm7XVoK84')
      l5.info()
      break
    case '!台語':
      const l6 = new LeaderboardTrack('1aT2xlLH21QAedmxlz')
      l6.info()
      break
    case '!粵語':
      const l7 = new LeaderboardTrack('Ksduyo5whgbL4dXdlQ')
      l7.info()
      break
  }
})

// https://www.postman.com/collections/5cd6236e9e9748fd1ed1

// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
