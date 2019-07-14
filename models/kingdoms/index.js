const mongoose = require('mongoose')
const schema = require('./schema')

const Model = mongoose.model('Kingdom', schema)

module.exports = Model
