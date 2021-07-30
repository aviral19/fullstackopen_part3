require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())


morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if(err.name === 'CastError') {
    return res.status(400).send({ error : 'malformatted id' })
  }
  next(err)
}

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
  ]


app.get('/', (request, response) => {
  response.send('Hello World!')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
    let cDate = new Date();
    response.send(`<div>Phonebook has info for ${Person.length} people</div>
                    <div>${cDate.toString()}</div>`)
})

app.get('/api/persons/:id', (request, response, next) =>{
    Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})


app.post('/api/persons', (request, response) => {
    const body = request.body
    
    // console.log(body)

    if(!body.name){
        return response.status(400).json({
            error: 'Name missing'
        })
    }
    if(!body.number){
        return response.status(400).json({
            error: 'Number missing'
        })
    }

    const person = new Person({
    name: body.name,
    number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)
    // response.status(204).end()
})
  
  
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

