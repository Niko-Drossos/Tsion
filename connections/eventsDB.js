const mongoose = require('mongoose')
const { MONGO_URL_EVENT } = process.env

const eventDB = mongoose.createConnection(MONGO_URL_EVENT);

module.exports = eventDB
