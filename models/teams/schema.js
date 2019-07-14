const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
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
  uniqueComparator: String,
  comment: String
}

const options = {
  versionKey: false,
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)

schema.pre('save', function (next) {
  this.uniqueComparator = this.troops.reduce((arr, troop) => {
    const _id = troop._id
    arr.push(_id)
    return arr
  }, []).join('')
  next()
})

schema.pre('save', function (next) {
  if (this.comment) {
    const hashtags = /#((?:[가-힣]|\w)+)/g
    const matched = this.comment.match(hashtags)
    this.tags = matched || []
    this.comment = this.comment.trim()
  }
  next()
})

schema.statics.findByTags = function (tags) {
  return this.aggregate()
    .match({ comment: { $exists: true } })
    .match({ tags: { $all: tags } })
    .sort({ createdAt: -1 })
    .unwind('tags')
    .group({
      _id: '$uniqueComparator',
      troops: { $first: '$troops' },
      tags: { $addToSet: '$tags' },
      createdAt: { $first: '$createdAt' }
    })
    .sort({ createdAt: -1 })
}

schema.plugin(autoIncrement.plugin, {
  model: 'Team',
  startAt: 10000
})

schema.index({ comment: 1, tags: 1, createdAt: -1 })

module.exports = schema
