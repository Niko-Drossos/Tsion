const mongoose = require("mongoose")
const Schema = mongoose.Schema
const dataDB = require('@/connections/dataDB')
require('dotenv').config()

const timerSchema = new Schema({
  description: {
    type: String,
    required: false,
    default: ""
  }
}, {
  timestamps: true,
  collection: "Timer"
})

const Timer = dataDB.model("times", timerSchema)

dataDB.once('open', () => {
  console.log('Connected to dataDB for Timer')
})

module.exports = Timer;