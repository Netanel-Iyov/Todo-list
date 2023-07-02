const express = require('express')
const router = express.Router()

const { jwtAuth } = require('../utils/jwtAuth') // JWT authentication middleware
const Todo = require('../models/Todo') // Todo model

/**
 * Route for creating a new todo.
 * Requires JWT authentication.
 */
router.post('/new', jwtAuth, async (req, res) => {
  try {
    const user = req.user

    const todo = new Todo({
      title: req.body.title,
      description: req.body.description,
      userID: user.id
    })

    const savedTodo = await todo.save()

    res.json(savedTodo)
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Return a 400 Bad Request status if the todo validation fails
      res.status(400).json(error)
    } else {
      // Return a 500 Internal Server Error status for any other errors
      res.status(500).json({ error: 'An error occurred' })
    }
  }
})

/**
 * Route for deleting a todo by ID.
 */
router.delete('/delete/:id', async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id)

  res.json(result)
})

/**
 * Route for toggling the complete status of a todo by ID.
 */
router.put('/complete/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)
  todo.complete = !todo.complete
  todo.save()

  res.json(todo)
})

/**
 * Route for updating the title and description of a todo by ID.
 */
router.put('/update/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)
  todo.title = req.body.title
  todo.description = req.body.description
  todo.save()

  res.json(todo)
})

module.exports = router
