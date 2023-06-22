require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const todoRoute = require('./routes/Todo')
const userRoute = require('./routes/User')

const { jwtAuth } = require('./utils/jwtAuth') 

app.use(cors({origin: "http://192.168.1.152:3000"}))
app.use(express.json())

app.use('/todo', todoRoute)
app.use('/user', userRoute)

let mongoConnectionString = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_ADDRESS}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
// let mongoConnectionString = `mongodb://${process.env.MONGO_DB_ADDRESS}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`
// let mongoConnectionString = ''

// if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
//     mongoConnectionString = `mongodb://127.0.0.1:27017/todo-list`
// } else {
//     mongoConnectionString = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_ADDRESS}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
// }

mongoose.connect(mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to DB"))
.catch(console.error)

const Todo = require('./models/Todo')

app.post('/todos', jwtAuth, async(req, res) => {
    const user = req.user
    const todos = await Todo.find({ userID: user.id });

    
    res.json(todos);

})

app.listen(3001, () => console.log("Server started on port 3001"))
