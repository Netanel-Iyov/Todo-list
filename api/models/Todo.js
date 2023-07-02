const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define the schema for the Todo model
const TodoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  complete: {
    type: Boolean,
    default: false
  },
  userID: {
    type: String,
    required: [true, "userID is required"]
  },
  timestamp: {
    type: String,
    default: Date.now()
  }
})

// Create the Todo model using the TodoSchema
const Todo = mongoose.model("Todo", TodoSchema)

module.exports = Todo
