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

schema.query.byUniqueComparator = function (comparator) {
  return this.where({ comment: { $exists: true } })
    .where({ uniqueComparator: comparator })
    .sort({ createdAt: -1 })
}

schema.statics.findAllTags = function () {
  return this.aggregate()
    .match({ comment: { $exists: true } })
    .unwind({
      path: '$tags',
      preserveNullAndEmptyArrays: true
    })
    .group({
      _id: 1,
      tags: { $addToSet: '$tags' }
    })
    .then((result) => {
      return result[0].tags.sort()
    })
}

schema.statics.findByTroopname = function (troopname) {
  return this.aggregate()
    .match({ comment: { $exists: true } })
    .match({ 'troops.name': { $regex: new RegExp(troopname, 'i') } })
    .sort({ createdAt: -1 })
    .unwind({
      path: '$tags',
      preserveNullAndEmptyArrays: true
    })
    .group({
      _id: '$uniqueComparator',
      troops: { $first: '$troops' },
      tags: { $addToSet: '$tags' },
      createdAt: { $first: '$createdAt' }
    })
    .sort({ createdAt: -1 })
}

schema.statics.findByUsername = function (username) {
  return this.aggregate()
    .match({ comment: { $exists: true } })
    .match({ username })
    .sort({ createdAt: -1 })
    .unwind({
      path: '$tags',
      preserveNullAndEmptyArrays: true
    })
    .group({
      _id: '$uniqueComparator',
      troops: { $first: '$troops' },
      tags: { $addToSet: '$tags' },
      createdAt: { $first: '$createdAt' }
    })
    .sort({ createdAt: -1 })
}

schema.statics.findByTags = function (tags) {
  return this.aggregate()
    .match({ comment: { $exists: true } })
    .match({ tags: { $all: tags } })
    .sort({ createdAt: -1 })
    .unwind({
      path: '$tags',
      preserveNullAndEmptyArrays: true
    })
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
schema.index({ comment: 1, username: 1, createdAt: -1 })
schema.index({ comment: 1, 'troops.name': 1, createdAt: -1 })
schema.index({ comment: 1, uniqueComparator: 1, createdAt: -1 })

module.exports = schema
