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
const uploadToCloudinary = function(next) {
  const self   = this;
  this.constructor.find({concat_title: self.concat_title})
    .then(result => {
      if(result.length === 0) {
        cloudinary.uploader.upload(self.image.normal, (result) => {
          self.image.normal = result.public_id
          next()
        }, { public_id: `wowpapers/${self.concat_title}` })
      }
      else {
        const err = new Error('Image with name already exists')
        next(err)
      }
    })
    .catch(err => next(err))
}

// Middleware Hooks
postSchema.pre('save', uploadToCloudinary)

// Export Model
const Post = mongoose.model('Post', postSchema)
export default Post
