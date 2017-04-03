// Imports and Setup
const controller = {}

// Route Functions
controller.get = (req,res,next) => {
  res.send('Welcome to the API!')
}

// Export Controller
export default controller
