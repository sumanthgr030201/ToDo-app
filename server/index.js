const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const toDoModel = require('./module/todoModel')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/todo')

app.post('/todos', (req, res) => {
    const { task, description, completed } = req.body;
    toDoModel.create({
        task,
        description,
        completed
    }).then(result => res.json(result))
      .catch(err => res.json(err))
})

app.put('/todos/:id', (req, res) => {
    const { task, description, completed } = req.body;
    toDoModel.findByIdAndUpdate(req.params.id, {
        task,
        description,
        completed
    }, { new: true })
      .then(result => res.json(result))
      .catch(err => res.json(err))
})

app.delete('/todos/:id', (req, res) => {
    toDoModel.findByIdAndDelete(req.params.id)
      .then(() => res.json({ message: 'Task deleted successfully.' }))
      .catch(err => res.json(err))
})

app.get('/todos', (req, res) => {
    toDoModel.find()
      .then(todos => res.json(todos))
      .catch(err => res.json(err))
})

app.listen(9001, () => {
    console.log('App is running on port 9001.....')
})
