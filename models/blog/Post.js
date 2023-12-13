const mongoose = require("mongoose");
const Schema = mongoose.Schema
const blogDB = require('@/connections/blogDB')
const Comment = require('./commentModel'); // Import the Comment model
require('dotenv').config()


let postSchema = new Schema({
  author: { type: String, required: true }, 
  profilePhoto: { type: String, required: true},
  posterID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  title: { type: String, required: true },
  content: { type: String, required: true },
  votes: { type: Array, required: false },
  voteCount: { type: Number, required: false },
  imageUrl: { type: String, required: false },
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