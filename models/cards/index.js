const mongoose = require('mongoose')
const schema = require('./schema')

const Model = mongoose.model('Card', schema)

module.exports = Model
