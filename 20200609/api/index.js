import express from 'express'
import db from './db.js'
// 讓express 可以讀取 post 資料
import bodyParser from 'body-parser'
import md5 from 'md5'

const app = express()

// 讓 express 使用 bodyParser 並把收到的資料轉 json
app.use(bodyParser.json())

app.post('/new', async (req, res) => {
  // 拒絕不是 json 資料的格式
  if (req.headers['content-type'] !== 'application/json') {
    // 回傳錯誤狀態碼
    // http://expressjs.com/en/5x/api.html#res.status
    res.status(400).send({ success: false, message: '格式不符' })
    // 讓下面不執行
    return
  }
  if (
    req.body.name === undefined ||
    req.body.account === undefined ||
    req.body.password === undefined ||
    req.body.email === undefined
  ) {
    // 回傳錯誤狀態碼
    res.status(400).send({ success: false, message: '欄位不正確' })
    return
  }

  // 新增資料
  try {
    // https://mongoosejs.com/docs/api/model.html
    const result = await db.create(
      {
        name: req.body.name,
        account: req.body.account,
        password: md5(req.body.password),
        email: req.body.email
      }
    )
    console.log(result)
    // res.status 預設為 200
    res.status(200).send({ success: true, message: '', id: result._id })
  } catch (error) {
    const key = Object.keys(error.errors)[0]
    const message = error.errors[key].message
    res.status(400).send({ success: false, message: message })
  }
})

app.get('/find', async (req, res) => {
  if (req.query.id === undefined) {
    res.status(400).send({ success: false, message: '欄位不正確' })
    return
  }

  try {
    // https://mongoosejs.com/docs/api/model.html
    // https://mongoosejs.com/docs/api/model.html#model_Model.findById
    const result = await db.findById(req.query.id, 'account -_id')
    console.log(result)
    res.status(200).send({ success: true, message: '', account: result.account })
  } catch (error) {
    // 找不到東西
    res.status(404).send({ success: false, message: '找不到' })
  }
})

app.patch('/update/:type', async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    // 回傳錯誤狀態碼
    // http://expressjs.com/en/5x/api.html#res.status
    res.status(400).send({ success: false, message: '格式不符' })
    // 讓下面不執行
    return
  }
  if (
    req.params.type !== 'account' &&
    req.params.type !== 'password' &&
    req.params.type !== 'name' &&
    req.params.type !== 'email'
  ) {
    res.status(400).send({ success: false, message: '更新欄位不符' })
  }

  try {
    // findByIdAndUpdate 預設回來的 result 是更新前的資料
    // 加上 new true 後可以回來新的資料
    const type = req.params.type
    await db.findByIdAndUpdate(req.body.id, {
      [type]: req.body.data
    }, { new: true })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '發生錯誤' })
  }
})

app.delete('/delete', async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    // 回傳錯誤狀態碼
    // http://expressjs.com/en/5x/api.html#res.status
    res.status(400).send({ success: false, message: '格式不符' })
    // 讓下面不執行
    return
  }
  try {
    // findByIdAndUpdate 預設回來的 result 是更新前的資料
    // 加上 new true 後可以回來新的資料
    const result = await db.findByIdAndDelete(req.body.id)
    if (result === null) {
      res.status(404).send({ success: false, message: '找不到資料' })
    } else {
      res.status(200).send({ success: true, message: '' })
    }
  } catch (error) {
    res.status(500).send({ success: false, message: '發生錯誤' })
  }
})

app.listen(8888, () => {
  console.log('網頁伺服器已啟動')
  console.log('http://localhost:8888')
})
