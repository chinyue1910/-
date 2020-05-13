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

const option = {
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
    const response = await rp(option)
    token = response.access_token
  } catch (error) {
    console.log(error.message)
    console.log('false')
  }
}
// 時間差問題，console.log(token) 要等一下

getToken()

bot.on('message', async function (event) {
  const optionSearch = {
    uri: 'https://api.kkbox.com/v1.1/search',
    qs: {
      q: event.message.text,
      territory: 'TW',
      limit: '5',
      type: 'track'
    },
    auth: {
      bearer: token
    },
    json: true
  }
  const optionCharts = {
    uri: 'https://api.kkbox.com/v1.1/charts',
    qs: {
      territory: 'TW'
    },
    auth: {
      bearer: token
    },
    json: true
  }
  // 排行榜 -----------------------------------------------------------
  try {
    const response = await rp(optionCharts)
    const aryChart = []
    const IDget = []
    const want = [0, 7, 8, 9, 10, 11, 12, 25, 27]
    for (const i of want) {
      aryChart.push(
        {
          thumbnailImageUrl: response.data[i].images[0].url,
          title: response.data[i].title,
          text: response.data[i].description,
          defaultAction: {
            type: 'uri',
            label: 'View detail',
            uri: response.data[i].url
          },
          actions: [{
            type: 'message',
            label: '查看排行歌曲',
            text: response.data[i].id
          }, {
            type: 'uri',
            label: '查看官方網址',
            uri: response.data[i].url
          }]
        }
      )
      IDget.push(response.data[i].id)
    }
    if (IDget.includes(event.message.text)) {
      const optionChartsTracks = {
        uri: 'https://api.kkbox.com/v1.1/charts/' + event.message.text,
        qs: {
          territory: 'TW'
        },
        auth: {
          bearer: token
        },
        json: true
      }
      try {
        const rep = await rp(optionChartsTracks)
        console.log(rep.tracks.data[0].url)
        const trackinfo = []
        for (let i = 0; i < 10; i++) {
          trackinfo.push(
            {
              thumbnailImageUrl: rep.tracks.data[i].album.images[0].url,
              title: rep.tracks.data[i].name,
              text: '歌手：' + rep.tracks.data[i].album.artist.name,
              defaultAction: {
                type: 'uri',
                label: 'View detail',
                uri: rep.tracks.data[i].url
              },
              actions: [{
                type: 'message',
                label: '立即試聽',
                text: '待更新'
              }, {
                type: 'uri',
                label: '查看官方網址',
                uri: rep.tracks.data[i].url
              }]
            }
          )
        }
        event.reply({
          type: 'template',
          altText: '行動裝置才看的到',
          template: {
            type: 'carousel',
            columns: trackinfo
          }
        })
      } catch (error) {
        console.log(error.msg)
      }
    } else if (event.message.text === 'rank') {
      event.reply({
        type: 'template',
        altText: '行動裝置才看的到',
        template: {
          type: 'carousel',
          columns: aryChart
        }
      })
    } else {
      // 搜尋 -----------------------------------------------------------
      // try {
      //   const response = await rp(optionSearch)
      //   console.log(response.tracks.data[0].name)
      //   event.reply(response.tracks.data[0].name)
      // } catch (error) {
      //   console.log(error.message)
      // }
      console.log('搜尋')
    }
  } catch (error) {
    console.log(error.message)
  }
})

// https://www.postman.com/collections/5cd6236e9e9748fd1ed1

// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
