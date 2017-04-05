// Imports and Setup
import db from './../models'
import async from 'async'
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

// Get Paginated Content Function (HELPER)
const getPaginated = (query, id, page, limit) => {
  return new Promise((resolve, reject) => {
    query.limit(limit).skip(limit*(page-1))
      .then(posts => {
        if(posts.length === 0) throw new Error("No Results")
        return posts
      })
      .then(posts => {
        async.map(posts, (item, cb) => {
          db.Like.find({_post: item._id}, (err, likes) => {
            let exists = []
            item = item.toObject()
            item.like_count = likes.length || 0
            if(id) exists = likes.filter((liked) => liked._creator == id)
            item.liked = (exists.length > 0)
            cb(null, item)
          })
        }, (err, results) => {
        query.skip(limit*page).count()
            .then(count => {
              resolve({
                success: true,
                data: results,
                next_count: count
              })
            })
        })
      })
      .catch(err => reject(err))
    })
}

// Get Single Result (Helper)
var getOneResult = function(query, id) {
  return new Promise((resolve, reject) => {
    query
      .then(post => {
          if(!post) throw new Error("No Results")
          return post
        })
      .then(post => {
          db.Like.find({_post: post._id}, (err, likes) => {
            let exists = []
            post = post.toObject()
            post.like_count = likes.length || 0
            if(id) exists = likes.filter((liked) => liked._creator == id)
            post.liked = (exists.length > 0)
            resolve({
              success: true,
              data: post,
            })
          })
      })
      .catch(err => reject(err))
    })
}

// Get All Posts
controller.get = (req,res,next) => {
  // Get Variables
  const id    = req.id
  const page  = req.query.page || 1
  const limit = Number(req.query.limit) || 5
  // Pass to Function
  getPaginated(db.Post.find({}), id, page, limit)
    .then(result => res.status(200).json(result))
    .catch(err => next(err))
}

// Search Posts
controller.searchByName = (req,res,next) => {
  // Get Variables
  const id    = req.id
  const name  = req.params.name
  const page  = req.query.page || 1
  const limit = Number(req.query.limit) || 5
  // Pass to Function
  getPaginated(db.Post.find({title: { "$regex": name, "$options": '?i' }}), id, page, limit)
    .then(result => res.status(200).json(result))
    .catch(err => next(err))
}

// Get Single Post By ID
controller.getSingleById = (req,res,next) => {
  // Get Variables
  var id     = req.id
  var postId = req.params.id
  // Pass to Function
  getOneResult(db.Post.findById(req.params.id), id)
    .then(result => res.status(200).json(result))
    .catch(err => next(err))
}

// Get Single Post By Slug
controller.getSingleBySlug = (req,res,next) => {
  // Get Variables
  var id   = req.id
  var slug = req.params.slug
  // Pass to Function
  getOneResult(db.Post.findOne({concat_title: req.params.slug}), id)
    .then(result => res.status(200).json(result))
    .catch(err => next(err))
}

// Like Post
controller.like = (req,res,next) => {
  const post = req.params.post
  const userId = req.id
  const like = new db.Like({_creator: userId, _post: post})

  like.addLike().then(() => {
    db.Like.find({_post: post}).count().then(count => {
      res.status(200).json({
        success: true,
        like_count: count
      })
    })
  })
  .catch(err => next(err))
}


// Export Controller
export default controller
