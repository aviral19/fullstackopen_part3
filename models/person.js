const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI
  

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('Connected to MongoDB!')
  })
  .catch(err => {
    console.log('error connecting to MongoDB', err.message)
  })

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)