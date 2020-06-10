import mongoose from 'mongoose'
import beautifyUnique from 'mongoose-beautiful-unique-validation'

const Schema = mongoose.Schema

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

mongoose.connect('mongodb://127.0.0.1:27017/market', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.plugin(beautifyUnique)

const userScheme = new Schema({
  name: {
    type: String,
    required: [true, '商品名稱必填'],
    minlength: [1, '商品名稱最少一個字'],
    maxlength: [20, '商品名稱最多 20 個字'],
    unique: '商品名稱重複'
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
