// Initialise Router
import express from 'express'
const router = express.Router()

// Importing Controllers to Router
import mainController from './../controllers/mainController'

// Middleware
// TODO: Add Authentication Check

// Non-Secure API Routes
router.get('/', mainController.get)

// Export Router
module.exports = router
 
