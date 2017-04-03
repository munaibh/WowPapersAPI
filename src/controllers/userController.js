// Imports and Setup
import db from './../models'
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
            res.status(200).json({
              success: true,
              username: user.username,
              token: 'Coming Soon'
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

// Export Controller
export default controller
