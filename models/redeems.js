const mongoose = require('mongoose')

const fields = {
  username: { type: String },
  first_name: { type: String },
  code: { type: String, uppercase: true, trim: true, match: /[a-zA-Z0-9]{10}/ },
  isAvailable: { type: Boolean, default: true }
}

const options = {
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
}

const schema = new mongoose.Schema(fields, options)

schema.index({ code: 1, isAvailable: 1 })
schema.index({ createdAt: -1 })

const Redeem = mongoose.model('Redeem', schema)

module.exports = Redeem