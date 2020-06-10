import express from 'express'
import db from './db.js'
import bodyParser from 'body-parser'

const app = express()
const port = 8888

app.use(bodyParser.json({ type: 'application/json' }))

app.post('/new', async (req, res) => {
  console.log(req.body)
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
    const result = await db.create(
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        count: req.body.count
      }
    )
    console.log(result)
    res.send({ success: true, message: '', id: result._id })
  } catch (error) {
    const message = error.errors[Object.keys(error.errors)[0]].message
    res.status(400).send({ success: false, message: message })
  }
})

app.patch('/update/:type', async (req, res) => {
  console.log(req.params)
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
  }
})

app.listen(port, () => {
  console.log('網頁伺服器已啟動')
  console.log(`Example app listening at http://localhost:${port}`)
})
