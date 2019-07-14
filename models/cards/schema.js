const mongoose = require('mongoose')

const fields = {
  _id: Number,
  name: String,
  colors: Number,
  imageUrl: String
}

const options = {
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)

module.exports = schema
