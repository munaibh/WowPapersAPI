// Imports and Setup
import mongoose from 'mongoose'
mongoose.Promise = global.Promise
const { Schema } = mongoose

// Schema
const likeSchema = new Schema({
  _creator: { type: Schema.ObjectId, ref: 'User' , required: true},
  _post: { type: Schema.ObjectId, ref: 'Post' , required: true},
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

// Custom Methods
likeSchema.methods.addLike = function() {
  const self = this
  const _post = this._post
  const _creator = this._creator

  return new Promise((resolve, reject) => {
    self.constructor.findOne({_creator, _post})
      .then(post => {
        if(post) {
          self.constructor.findByIdAndRemove(post._id, function(err, doc) {
            if(err) reject(err)
            resolve()
          })
        }
        else {
          var post = new self.constructor({_creator, _post})
          post.save().then(like => {
            resolve()
          })
          .catch(err => reject(err))
        }
      })
      .catch(err => reject(err))
  })

}

likeSchema.methods.getLikeCount = function() {
  const self = this
  const _post = this._post
  return new Promise((resolve, reject) => {
    self.constructor.find({ _post}).count()
      .then(count => resolve(count))
      .catch(err  => resolve(0))
  })
}

// Export Model
const Like = mongoose.model('Like', likeSchema)
export default Like
