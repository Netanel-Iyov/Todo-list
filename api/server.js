const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const todoRoute = require('./routes/Todo')
const userRoute = require('./routes/User')

app.use(express.json())
app.use(cors())
app.use('/todo', todoRoute)
app.use('/user', userRoute)

mongoose.connect("mongodb://127.0.0.1:27017/todo-list", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to DB"))
.catch(console.error)

const Todo = require('./models/Todo')

app.get('/todos', async(req, res) => {
    const todos = await Todo.find();

    res.json(todos);
})

app.listen(3001, () => console.log("Server started on port 3001"))
