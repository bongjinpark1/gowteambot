const mongoose = require('mongoose')
const schema = require('./schema')

const Model = mongoose.model('Team', schema)

module.exports = Model
