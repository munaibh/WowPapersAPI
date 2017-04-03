// Imports and Setup
import db from './../models'
const controller = {}

// Route Functions
controller.create = (req,res,next) => {

  const image  = req.files.image.file
  const title  = req.body.title
  const concat_title = title.toLowerCase().replace(/\s+/g, '-')

  const post = new db.Post({ title, concat_title, image: { normal: image }})

  post.save()
    .then(newPost => {
      res.status(200).json({
        success: true,
        data: newPost
      })
    })
    .catch(err => next(err))
    
}


// Export Controller
export default controller
