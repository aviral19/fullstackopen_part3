const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

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

const Person = mongoose.model('Person', personSchema)


if(process.argv.length < 4) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}
else{
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
         
    person.save().then(result => {
        console.log(result)
        mongoose.connection.close()
    })
}

module.exports = mongoose.model('Person', personSchema)