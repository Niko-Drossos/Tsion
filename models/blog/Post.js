const mongoose = require("mongoose");
const Schema = mongoose.Schema
const blogDB = require('@/connections/blogDB')
require('dotenv').config()


let postSchema = new Schema({
  user: {
    author: { type: String, required: true }, 
    avatar: { type: String, required: true},
    posterID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  votes: { type: Array, required: false },
  voteCount: { type: Number, required: false },
  images: { type: Array, required: false },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false }]
},{
  collection: 'posts',
  timestamps: true
})

const Post = blogDB.model('Post', postSchema)

blogDB.once('open', () => {
    console.log('Connected to blogDB for post')
})


module.exports = Post