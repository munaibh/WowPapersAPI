// Initialise Router
import express from 'express'
const router = express.Router()

// Importing Controllers to Router
import mainController from './../controllers/mainController'
import userController from './../controllers/userController'
import postController from './../controllers/postController'

// Middleware
// TODO: Add Authentication Check

// Non-Secure API Routes
router.get('/', mainController.get)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.get('/posts', postController.get)
router.post('/posts', postController.create)

// Export Router
module.exports = router
