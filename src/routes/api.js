// Initialise Router
import express from 'express'
const router = express.Router()

// Importing Controllers to Router
import mainController from './../controllers/mainController'
import userController from './../controllers/userController'
import postController from './../controllers/postController'

// Middleware
// TODO: Add Better Authentication
// TODO: Rename Routes
// TODO: Add More Structure Middleware
// TODO: Comment Code

// Non-Secure API Routes
router.get('/', mainController.get)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.get('/me', mainController.authenticateUser, userController.getCurrentUser)
router.get('/posts', mainController.getCredentials, postController.get)
router.get('/posts/search/:name', mainController.getCredentials, postController.searchByName)
router.get('/posts/:id', mainController.getCredentials, postController.getSingleById)
router.get('/posts/name/:slug', mainController.getCredentials, postController.getSingleBySlug)

// Secure API Routes
router.post('/posts', mainController.authenticateUser, postController.create)
router.post('/posts/like/:post', mainController.authenticateUser, postController.like)

// Export Router
module.exports = router
