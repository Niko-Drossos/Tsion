import mongoose from 'mongoose'
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.models.Post || mongoose.model("Post", postSchema)