const mongoose = require('mongoose')

const url = process.env.DB_URL
const options = {
  useCreateIndex: true,
  useNewUrlParser: true
}

module.exports = fn => {
  mongoose.connect(url, options, () => {
    console.log('DB connected.')
    fn()
  })
}
