// Imports
import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import busboy from 'express-busboy'

// Initialisation
const app  = express()
const port = process.env.PORT || 3000
const database = process.env.DB_NAME

// Some Setup
dotenv.config()
busboy.extend(app, { upload: true })
mongoose.connect(`mongodb://localhost:27017/${database}`)

// Main Routes
app.use('/api', require('./routes/api'))

// Error Routes
app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({message: err.message})
})

// Start the Magic (Server)
app.listen(port, () => {
  console.log(`Listening on Port: ${port}`)
})
