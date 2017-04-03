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

// Export Controller
export default controller
