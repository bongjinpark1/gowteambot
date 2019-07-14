const mongoose = require('mongoose')
const schema = require('./schema')

const Model = mongoose.model('Class', schema)

module.exports = Model
