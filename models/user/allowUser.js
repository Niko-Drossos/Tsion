const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userDB = require('@/connections/userDB')
require("dotenv").config()

const allowUserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  }
}, {
  collection: 'allowedUsers',
  timestamps: true
})

const allowedUser = userDB.model('AllowUser', allowUserSchema)

userDB.once('open', () => {
  console.log('Connected to userDB')
})

module.exports = allowedUser