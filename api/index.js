const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const todoRoute = require('./routes/Todo')
const userRoute = require('./routes/User')

const jwt = require('jsonwebtoken');
const { jwtAuth } = require('./utils/jwtAuth') 

app.use(cors({origin: "http://localhost:3000"}))
app.use(express.json())

app.use('/todo', todoRoute)
app.use('/user', userRoute)

mongoose.connect("mongodb://127.0.0.1:27017/todo-list", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to DB"))
.catch(console.error)

const Todo = require('./models/Todo')

app.post('/todos', jwtAuth, async(req, res) => {
    token = req.body.token
    const user = jwt.verify(token, 'your_secret_key');
    const todos = await Todo.find({ userID: user.id });

    res.json(todos);
})

app.listen(3001, () => console.log("Server started on port 3001"))
