// Imports and Setup
import jwt from 'jsonwebtoken'
const controller = {}

// Route Functions
controller.get = (req,res,next) => {
  res.send('Welcome to the API!')
}

// Retrieve User Credentials (If Logged In)
controller.getCredentials = (req,res,next) => {
  var token = req.body.token || req.headers['token']
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decode) {
      if(!err) { req.id = decode.id }
      next()
    })
  } else { next() }
}

// Allow Allow Access If Logged In
controller.authenticateUser = (req,res,next) => {
  var token = req.body.token || req.headers['token']
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decode) {
      if(!err) {
        req.id = decode.id
        req.username = decode.username
        return next();
      } else {
        let err = new Error('Access Denied.')
        err.stats = 401
        next(err)
      }
    })
  } else {
    let err = new Error('Access Denied.')
    err.stats = 401
    next(err)
  }
}

// Export Controller
export default controller
