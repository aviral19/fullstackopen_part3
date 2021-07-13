const { response } = require('express')
const express = require('express')
const { isMatch } = require('picomatch')
const morgan = require('morgan')

const app = express()

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

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
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    let cDate = new Date();
    response.send(`<div>Phonebook has info for ${persons.length} people</div>
                    <div>${cDate.toString()}</div>`)
})

app.get('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    // console.log(id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }
    else {
        response.status(404).end()
    }
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
    
    if(persons.find(person => person.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
    id: Math.floor(Math.random() * (100000 - persons.length) + persons.length),
    name: body.name,
    number: body.number
    }

    
    
    // console.log(person)
    response.json(person)
})




app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

