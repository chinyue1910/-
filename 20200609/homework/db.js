import mongoose from 'mongoose'

const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/market', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const userScheme = new Schema({
  name: {
    type: String,
    required: [true, '商品名稱必填'],
    minlength: [1, '商品名稱最少一個字'],
    maxlength: [20, '商品名稱最多 20 個字']
  },
  price: {
    type: Number,
    required: [true, '商品價格必填']
  },
  description: {
    type: String,
    maxlength: [100, '商品敘述最多 100 個字']
  },
  count: {
    type: Number,
    required: [true, '商品數量必填']
  }
})

const market = mongoose.model('market', userScheme)
export default market
