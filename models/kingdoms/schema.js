const mongoose = require('mongoose')

const fields = {
  _id: Number,
  name: String,
  bannerName: String
}

const options = {
  versionKey: false,
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)

module.exports = schema
