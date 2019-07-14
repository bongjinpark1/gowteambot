const mongoose = require('mongoose')
const fields = {
  troops: [{
    _id: Number,
    name: String
  }],
  kingdom: {
    _id: Number,
    name: String,
    bannerName: String
  },
  heroClass: {
    _id: Number,
    name: String
  },
  talents: [Number],
  username: String,
  first_name: String,
  chatId: Number,
  tags: [String],
  teamcode: String,
  comment: String
}

const options = {
  versionKey: false,
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)

schema.pre('save', function (next) {
  if (this.comment) {
    const hashtags = /#((?:[가-힣]|\w)+)/g
    const matched = this.comment.match(hashtags)
    this.tags = matched || []
    this.comment = this.comment.trim()
  }
  next()
})

module.exports = schema
