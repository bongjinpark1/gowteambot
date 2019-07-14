const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const url = process.env.DB_URL
const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
}

module.exports = fn => {
  mongoose.connect(url, options, () => {
    console.log('DB connected.')
    autoIncrement.initialize(mongoose.connection)
    fn()
  })
}
