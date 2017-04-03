// Imports and Setup
import db from './../models'
const controller = {}

// Create Post
controller.create = (req,res,next) => {

  const image  = req.files.image.file
  const title  = req.body.title
  const _creator = req.id
  const concat_title = title.toLowerCase().replace(/\s+/g, '-')

  const post = new db.Post({ title, concat_title, image: { normal: image }, _creator })

  post.save()
    .then(newPost => {
      res.status(200).json({
        success: true,
        data: newPost
      })
    })
    .catch(err => next(err))

}

// Get Post
controller.get = (req,res,next) => {
  db.Post.find({})
    .then(posts => {
      res.status(200).json({
        success: true,
        data: posts
      })
    })
    .catch(err => next(err))
}


// Export Controller
export default controller
