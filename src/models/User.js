// Imports and Setup
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
mongoose.Promise = global.Promise
const { Schema } = mongoose

// Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: [6, "Username must exceed 5 characters."]
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must exceed 7 characters."]
  }
})

// Custom Methods
userSchema.methods.hashPassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(11, (err, salt) => {
      if(err) reject(err)
      bcrypt.hash(candidatePassword, salt, (err, hash) => {
        if(err) reject(err)
        resolve(hash)
      })
    })
  })
}

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if(err) cb(err, false)
    cb(null, isMatch)
  })
}

// Middleware Hooks
userSchema.pre('save', function(next) {
  const user = this.constructor
  user.findOne({ username: this.username })
    .then(existingUser => {
      if(existingUser) {
        const err = new Error("Username is taken.")
        err.status = 401
        next(err)
      }
      else { next() }
    })
    .catch(err => next(err))
})

userSchema.pre('save', function(next) {
  let user = this
  this.hashPassword(user.password)
    .then(newPassword => {
      user.password = newPassword
      next()
    })
    .catch(err => next(err))
})

// Export Model
const User = mongoose.model('User', userSchema)
export default User
