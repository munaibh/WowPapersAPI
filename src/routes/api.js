// Initialise Router
import express from 'express'
const router = express.Router()

// Importing Controllers to Router
import mainController from './../controllers/mainController'
import userController from './../controllers/userController'

// Middleware
// TODO: Add Authentication Check

// Non-Secure API Routes
router.get('/', mainController.get)
router.post('/register', userController.register)

// Export Router
module.exports = router
