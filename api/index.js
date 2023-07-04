// Importing required modules
require("dotenv").config({path: '../.env'}) // Loads environment variables from a .env file into process.env
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// Creating an instance of the Express application
const app = express()

// Importing route handlers
const todoRoute = require('./routes/Todo') // Handles routes for todos
const userRoute = require('./routes/User') // Handles routes for users

const { jwtAuth } = require('./utils/jwtAuth') // JWT authentication utility

// Applying middleware
app.use(cors({
    // Set the allowed origin for CORS requests
    origin: process.env.CORS_ORIGIN
}))

app.use(express.json()) // Parsing request bodies as JSON

// Registering route handlers
app.use('/todo', todoRoute) // Mounts the todoRoute at '/todo'
app.use('/user', userRoute) // Mounts the userRoute at '/user'

// Connecting to the MongoDB database
mongoose.connect(`${process.env.MONGO_DB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to DB"))
.catch(console.error)

const Todo = require('./models/Todo') // Importing the Todo model

// Route for creating a new todo (requires JWT authentication)
app.post('/todos', jwtAuth, async (req, res) => {
    const user = req.user
    const todos = await Todo.find({ userID: user.id })

    res.json(todos)
})

// Debug route for testing purposes
app.get('/debug', async (req, res) => {
    res.json({ greeting: "Welcome to the to-do list API" })
})

// Starting the server
app.listen(3001, () => console.log("Server started"))
