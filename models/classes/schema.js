const mongoose = require('mongoose')

const fields = {
  _id: Number,
  name: String
}

const options = {
  timestamps: true,
  versionKey: false
}

const schema = new mongoose.Schema(fields, options)

module.exports = schema
