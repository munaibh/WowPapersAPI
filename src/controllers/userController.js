// Imports and Setup
import db from './../models'
import jwt from 'jsonwebtoken'
const controller = {}

// Register User
controller.register = (req,res,next) => {

  const { username, password } = req.body
  const user = new db.User({username, password})

  user.save()
    .then(newUser => {
      res.status(201).json({
        success: true,
        data: newUser
      })
    })
    .catch(err => next(err))

}

controller.login = (req,res,next) => {

  const { username, password } = req.body

  db.User.findOne({ username })
    .then(user => {
      if(user) {
        user.comparePassword(password, (err, isMatch) => {
          if(isMatch) {
            // JWT Data
            const data   = { id: user._id, username: user.username }
            const token  = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: 4000 })
            // Success Response
            res.status(200).json({
              success: true,
              username: user.username,
              token: token
            })
          }
          else {
            let err = new Error("Username or Password Incorrect.")
            err.status = 401
            next(err)
          }
        })
      } else {
        let err = new Error("User does not exist.")
        err.status = 401
        next(err)
      }
    })
}

controller.getCurrentUser = (req,res,next) => {
  const token = req.body.token || req.headers['token']
  db.User.findById(req.id)
    .then(user => {
      res.status(200).json({
        username: user.username,
        token: token
      })
    })
    .catch(err => next(err))
}
// Export Controller
export default controller
