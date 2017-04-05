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
  _creator:  { type: Schema.ObjectId, ref: 'User' },
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

const getCloudinaryDetails = function(doc, next) {
  var thumbParams = { use_root_path: true, secure: true, width: 325, height: 245, crop: "fill" }
  var fullParams  = { use_root_path: true, secure: true}
  doc.image.normal    = cloudinary.url(doc.image.normal, fullParams)
  doc.image.teaser = cloudinary.url(doc.image.normal, thumbParams)
  next();
}

const populateCreator = function(next) {
  this.populate({
    path: '_creator',
    select: 'username -_id'
  })
  next()
}

// Middleware Hooks
postSchema.pre('save', uploadToCloudinary)
postSchema.post('init', getCloudinaryDetails)
postSchema.pre('find', populateCreator)
postSchema.pre('findOne', populateCreator)

// Export Model
const Post = mongoose.model('Post', postSchema)
export default Post
