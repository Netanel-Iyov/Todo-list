require("dotenv").config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const todoRoute = require('./routes/Todo')
const userRoute = require('./routes/User')

const { jwtAuth } = require('./utils/jwtAuth') 

app.use(cors({
        // origin: "https://todo-list-frontend-nine.vercel.app"
        origin: "http://192.168.1.152:3000"
    })
)
app.use(express.json())

app.use('/todo', todoRoute)
app.use('/user', userRoute)


mongoose.connect(`${process.env.MONGO_DB_URL}`, {
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

app.get('/debug', async(req, res) => {
    res.json({greeting: "welcome to tood-list api"})
})

app.listen(3001, () => console.log("Server started"))
