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

// 讀取 .env 檔
dotenv.config()
