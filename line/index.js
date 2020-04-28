// npm install -g nodemon 改成存檔會後會自動重新啟動 node.js
// npm install dotenv 讀取環境設定檔
// npm install linebot LINE 機器人
// package-lock.json 更詳細的套件內容，不要去動他
// .gitignore 忽略要上傳到 git hub 的內容
// 在 scripts 裡新增 "dev": "nodemon index.js" 讓網頁會自動重新整理
// npm install -g eslint 安裝 node.js eslint 讓程式碼格式化
// npm install 安裝所缺的套件

// 引用 linebot 套件
import linebot from 'linebot'
// 引用 dotenv 套件
import dotenv from 'dotenv'
// 引用 request 套件
import rp from 'request-promise'

// 讀取 .env 檔
dotenv.config()

// 宣告機器人的資訊
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 詳細可以看 linebot npm
// 當收到訊息時
bot.on('message', async (event) => {
  let msg = ''
  try {
    const data = await rp({ uri: 'https://kktix.com/events.json', json: true })
    msg = data.entry[0].title
  } catch (error) {
    msg = '發生錯誤'
  }
  event.reply(msg)
})

// 在 PORT 啟動
bot.listen('/', process.env.PORT, () => [
  console.log('機器人已啟動')
])

// ngrok authtoken 1b9P8tU0KP18opg8GJmshUNB1wt_7YcxYkpaN2tsedLp6DDe7
// npm install request
// npm install request-promise
