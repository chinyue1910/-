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
  // -------------------------------------------------------------------------------------------
  class Leaderboard {
    constructor() {
      this.ary = []
      this.want = [0, 1, 2, 3, 4, 5, 6, 25, 26]
      this.option = {
        uri: 'https://api.kkbox.com/v1.1/charts',
        qs: {
          territory: 'TW'
        },
        auth: {
          bearer: token
        },
        json: true
      }
    }

    async info() {
      try {
        const response = await rp(this.option)
        for (const i of this.want) {
          this.ary.push(
            {
              thumbnailImageUrl: response.data[i].images[0].url,
              title: response.data[i].title,
              text: response.data[i].description,
              actions: [{
                type: 'postback',
                label: '看看歌單',
                data: response.data[i].id
              }, {
                type: 'uri',
                label: 'KKbox官網',
                uri: response.data[i].url
              }]
            }
          )
        }
      } catch (error) {
        console.log(error)
      }
      event.reply({
        type: 'template',
        altText: 'this is a carousel template',
        template: {
          type: 'carousel',
          columns: this.ary
        }
      })
    }
  }
  // -------------------------------------------------------------------------------------------
  class Search {
    constructor() {
      this.ary = []
      this.option = {
        uri: 'https://api.kkbox.com/v1.1/search',
        qs: {
          q: event.message.text,
          territory: 'TW',
          limit: 10,
          type: 'track'
        },
        auth: {
          bearer: token
        },
        json: true
      }
    }

    async information() {
      try {
        const response = await rp(this.option)
        for (const i of response.tracks.data) {
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
      } catch (error) {
        console.log(error)
      }
      event.reply({
        type: 'template',
        altText: 'this is a carousel template',
        template: {
          type: 'carousel',
          columns: this.ary
        }
      })
    }
  }
  // -------------------------------------------------------------------------------------------
  if (event.message.text === 'rank') {
    const top = new Leaderboard()
    top.info()
  } else if (event.message.text === 'aaa') {
    console.log('你好')
  } else {
    const seartrack = new Search()
    seartrack.information()
  }
})

bot.on('postback', (event) => {
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
      } catch (error) {
        console.log(error)
      }
      event.reply({
        type: 'template',
        altText: 'this is a carousel template',
        template: {
          type: 'carousel',
          columns: this.ary
        }
      })
    }
  }
  const bbb = new LeaderboardTrack(event.postback.data)
  bbb.info()
})

// https://www.postman.com/collections/5cd6236e9e9748fd1ed1

// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
