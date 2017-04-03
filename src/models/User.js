// Imports and Setup
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
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

// Middleware Hooks and Methods

// Export Model
const User = mongoose.model('User', userSchema)
export default User
