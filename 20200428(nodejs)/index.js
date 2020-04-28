// node "js檔名"
// 方向鍵 "↑，↓" 可以重複呼叫上一次的指令
// 更改 package.json裡面的 scripts 後，npm run start 即可執行

// 從內建 http 套件引用變數，取名為 http
// require 是 CommonJS 語法
// const http = require("http")

// import 是 ECMAScript 語法
// 必須要 node.js > 13.0 
// 更改 package.json，新增 "type": "module"
import http from "http"

const server = http.createServer((req, res) => {
    res.writeHead(200)
    res.write("you are sucess")
    res.end()
})

// 在 port 1234 啟動，啟動後在 console 顯示訊息
server.listen(5678, () => {
    console.log("網頁伺服器已啟動:http://localhost:5678")
})
// ctrl+C 結束終端機之後再修改內容