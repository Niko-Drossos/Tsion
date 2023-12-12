import mongoose from 'mongoose'

const connectUserDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL_USER)
  } catch (error) {
    throw new Error("Connection to User MongoDB failed")
  }
}

const connectBlogDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL_BLOG)
  } catch (error) {
    throw new Error("Connection to Blog MongoDB failed")
  }
}

const connectChatDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL_CHAT)
  } catch (error) {
    throw new Error("Connection to Chat MongoDB failed")
  }
}

module.exports = { connectUserDB, connectBlogDB, connectChatDB }