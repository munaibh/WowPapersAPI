// Imports and Setup
import mongoose from 'mongoose'
import cloudinary from 'cloudinary'
mongoose.Promise = global.Promise
const { Schema } = mongoose

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

// Schema
const postSchema = new Schema({
  title: { type: String, required: true },
  concat_title: { type: String },
  image: {
    teaser: { type: String },
    normal: { type: String, required: true }
  },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

// Custom Methods

// Middleware Hooks

// Export Model
const Post = mongoose.model('Post', postSchema)
export default Post
