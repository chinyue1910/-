import mongoose from 'mongoose'
import beautifyUnique from 'mongoose-beautiful-unique-validation'
import validator from 'validator'

const Schema = mongoose.Schema

// https://mongoosejs.com/docs/deprecations.html
mongoose.set('useCreateIndex', true)
// https://www.npmjs.com/package/md5
mongoose.set('useFindAndModify', false)

// 連線到本機的 mongodb 的 user 資料庫
mongoose.connect('mongodb://127.0.0.1:27017/user', { useNewUrlParser: true, useUnifiedTopology: true })
// global plugin
mongoose.plugin(beautifyUnique)

// 定義資料
const userSchema = new Schema({
  // 欄位名稱
  name: {
    type: String,
    // 必填欄位，自訂錯誤訊息
    required: [true, '使用者名稱必填'],
    minlength: [2, '使用者名稱最少 2 個字'],
    maxlength: [20, '使用者名稱最多 20 個字']
  },
  account: {
    type: String,
    // 必填欄位，自訂錯誤訊息
    required: [true, '帳號必填'],
    minlength: [8, '帳號最少 8 個字'],
    maxlength: [20, '帳號最多 20 個字'],
    // 避免重複，只能設定 true，無法自訂錯誤訊息，除非使用套件
    unique: '帳號重複'
  },
  password: {
    type: String,
    // 必填欄位，自訂錯誤訊息
    required: [true, '密碼必填'],
    minlength: [2, '密碼最少 2 個字']
  },
  email: {
    type: String,
    // 必填欄位，自訂錯誤訊息
    required: [true, '信箱必填'],
    // 自訂驗證規則
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '信箱格式錯誤'
    }
  }
}
// 是否顯示修改次數
// , {
//   versionKey: false
// }
)

// 資料表變數 = mongoose.model(資料表名稱，對應的 Schema)
const user = mongoose.model('user', userSchema)
export default user
