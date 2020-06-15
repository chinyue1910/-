import express from 'express'
import db from './db.js'
import bodyParser from 'body-parser'
import multer from 'multer'
// Node.js 預設的路徑套件
import path from 'path'
// Node.js 預設的檔案套件
import fs from 'fs'
// Express 處理跨網域要求
import cors from 'cors'
// 登入狀態
import session from 'express-session'
// 將登入狀態存入資料庫
import connectMongo from 'connect-mongo'

const MongoStore = connectMongo(session)

const app = express()
const port = 8888

app.use(session({
  // 密鑰，加密認證資料用
  secret: 'chinyue',
  // 登入狀態有效期間
  cookie: {
    maxAge: 1000 * 60 * 30
  },
  // 是否保存沒有被修改過的認證狀態
  saveUninitialized: false,
  // 是否每次重新計算過期時間
  rolling: true,
  // 存入 mongodb
  store: new MongoStore({
    mongooseConnection: db.connection
  })
}))
app.use(cors({
  // origin 來源網域
  // callback(錯誤，是否允許)
  origin (origin, callback) {
    callback(null, true)
  },
  // 是否允許認證資訊
  credentials: true
}))
// 檔案上傳設定
const upload = multer({
  // 檔案暫存
  // multer.diskStorage 代表存在電腦上
  storage: multer.diskStorage({
    // 儲存路徑
    // req 代表使用者丟進來的資料
    // file 代表使用者上傳的檔案
    // cb 代表回應
    destination (req, file, cb) {
      // cb(錯誤訊息，沒有就是 null, 路徑)
      cb(null, 'images/')
    },
    // 檔名
    filename (req, file, cb) {
      const now = Date.now()
      // 副檔名
      // 使用 path 套件取得上傳檔案原始檔名的副檔名
      const ext = path.extname(file.originalname)
      // cb(錯誤訊息，沒有就是 null, 目前的時間)
      cb(null, now + ext)
    },
    limits: {
      // 限制大小不超過 1 MB
      fileSize: 1024 * 1024
    },
    fileFilter (req, file, cb) {
      if (file.mimetype.includes('image')) {
        // 沒有錯誤，接受檔案
        cb(null, true)
      } else {
        // 觸發 multer 錯誤，不接受檔案
        // LIMIT_FORMAT 是自訂的錯誤 CODE，跟內建的錯誤 CODE 格式統一
        cb(new multer.MulterError('LIMIT_FORMAT'), false)
      }
    }
  })
})

app.use(bodyParser.json({ type: 'application/json' }))

// 上傳 + 新增
app.post('/image', async (req, res) => {
  if (!req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ sucess: false, message: '請回傳 json 格式' })
    return
  }
  // 有一個上傳進來的檔案，欄位是 image
  // req 進來的東西
  // res 要出去的東西
  // err 檔案上傳的錯誤
  // upload.single(欄位)(req, res, 上傳完畢的 function)
  upload.single('image')(req, res, async err => {
    if (err instanceof multer.MulterError) {
      const msg = (err.code === 'LIMIT_FILE_SIZE') ? '檔案太大' : '格式不符'
      res.status(400).send({ success: false, message: msg })
    } else if (err) {
      res.status(500).send({ success: false, message: '伺服器發生錯誤' })
    } else {
      try {
        console.log(req)
        const result = await db.market.create({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          count: req.body.count,
          image: req.file.filename
        })
        res.send({ success: true, message: '', id: result._id })
      } catch (error) {
        const message = error.errors[Object.keys(error.errors)[0]].message
        res.status(400).send({ success: false, message: message })
        console.log(error)
      }
    }
  })
})
// 新增
app.post('/new', async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).send({ sucess: false, message: '請回傳 json 格式' })
    return
  }
  if (
    req.body.name === undefined ||
    req.body.price === undefined ||
    req.body.description === undefined ||
    req.body.count === undefined
  ) {
    res.status(400).send({ sucess: false, message: '欄位不正確' })
    return
  }

  try {
    const result = await db.market.create(
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        count: req.body.count
      }
    )
    res.send({ success: true, message: '', id: result._id })
  } catch (error) {
    const message = error.errors[Object.keys(error.errors)[0]].message
    res.status(400).send({ success: false, message: message })
    console.log(error)
  }
})
// 修改
app.patch('/update/:type', async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).send({ sucess: false, message: '請回傳 json 格式' })
    return
  }
  if (
    req.params.type !== 'name' &&
    req.params.type !== 'price' &&
    req.params.type !== 'description' &&
    req.params.type !== 'count'
  ) {
    res.status(400).send({ sucess: false, message: '更新欄位不符' })
    return
  }

  try {
    const type = req.params.type
    await db.market.findByIdAndUpdate(req.body.id, {
      [type]: req.body.data
    }, { new: true })
    res.send({ success: true, message: '' })
  } catch (error) {
    console.log(error.msg)
    res.status(500).send({ success: false, message: '發生錯誤' })
  }
})
// 刪除
app.delete('/delete', async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).send({ sucess: false, message: '請回傳 json 格式' })
    return
  }

  try {
    const result = await db.market.findOneAndDelete(req.body.id)
    if (result === null) {
      res.status(404).send({ success: false, message: '找不到資料' })
    } else {
      res.send({ success: true, message: '' })
    }
  } catch (error) {
    res.status(500).send({ success: false, message: '發生錯誤' })
  }
})
// 查詢商品
app.get('/product', async (req, res) => {
  if (req.query.id === undefined) {
    res.status(400).send({ success: false, message: '欄位不正確' })
    return
  }

  try {
    const result = await db.market.findById(req.query.id)
    res.send({
      success: true,
      message: '',
      name: result.name,
      price: result.price,
      description: result.description,
      count: result.count
    })
  } catch (error) {
    res.status(404).send({ success: false, message: '找不到' })
  }
})
// 查詢所有商品
app.get('/all', async (req, res) => {
  if (req.session.user) {
    try {
      let result = await db.market.find().select({ _id: 0, __v: 0 })
      result = result.map(product => {
        product.image = 'http://localhost:8888/images/' + product.image
        return product
      })
      console.log(result)
      res.send({ sucess: true, message: '', products: result })
    } catch (error) {
      console.log(error)
      res.status(404).send({ success: false, message: '目前無任何資料' })
    }
  } else {
    res.status(401).send({ success: false, message: '請登入' })
  }
})
// 查詢庫存商品
app.get('/instock', async (req, res) => {
  try {
    const result = await db.market.find({ count: { $gte: 5 } }).select({ _id: 0, __v: 0 })
    res.send({ sucess: true, message: '', products: result })
  } catch (error) {
    res.status(404).send({ success: false, message: '目前無任何資料' })
  }
})

app.get('/findimage/:file', async (req, res) => {
  // fs.existsSync() 可以檢查檔案在不在，只能用絕對路徑
  // process.cwd() 可以知道目前運作的 js 檔在哪裡
  const path = process.cwd() + '/images/' + req.params.file
  const exists = fs.existsSync(path)
  if (exists) {
    // res.sendFile(路徑)
    // 路徑只能放絕對路徑，不然就是要設定 root 為 process.cwd()
    // res.sendFile(路徑, {root: process.cwd()})
    // 預設是從根目錄找檔案，所以要設定根目錄為目前的資料夾
    res.sendFile(path)
  } else {
    res.status(404).send({ sucess: false, message: '檔案不存在' })
  }
})

app.post('/login', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ sucess: false, message: '請回傳 json 格式' })
    return
  }
  try {
    const result = await db.user.find(
      {
        account: req.body.account,
        password: req.body.password
      }
    )
    console.log(result)
    if (result.length > 0) {
      const account = result[0].account
      req.session.user = account
      res.send({ success: true, message: '', account })
    } else {
      res.send({ success: false, message: '帳號密碼錯誤' })
    }
  } catch (error) {
    res.status(400).send({ success: false, message: '帳號密碼錯誤' })
  }
})

app.get('/logout', async (req, res) => {
  // 刪除狀態
  req.session.destroy(error => {
    if (error) {
      res.status(500).send({ success: true, message: '伺服器發生錯誤' })
    } else {
      res.clearCookie().send({ success: true, message: '' })
    }
  })
})

app.get('/checksession', async (req, res) => {
  res.send({ success: true, message: '', user: req.session.user })
})

app.listen(port, () => {
  console.log('網頁伺服器已啟動')
  console.log(`Example app listening at http://localhost:${port}`)
})
