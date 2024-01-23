const mongoose = require('mongoose')
const { MONGO_URL_DATA } = process.env

const dataDB = mongoose.createConnection(MONGO_URL_DATA);

module.exports = dataDB
