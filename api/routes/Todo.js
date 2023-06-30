const express = require('express')
const router = express.Router()

const { jwtAuth } = require('../utils/jwtAuth') 
const Todo = require('../models/Todo')

router.post('/new', jwtAuth ,async(req, res) => {  
    try {
      
        const user = req.user

        const todo = new Todo({
          text: req.body.text,
          userID: user.id
        });
    
        const savedTodo = await todo.save();
        res.json(savedTodo);
      } catch (error) {
        if (error.name === 'ValidationError') {
          res.status(400).json(error);
        } else {
          res.status(500).json({ error: 'An error occurred' });
        }
    }
})

router.delete('/delete/:id', async (req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id)

    res.json(result)
})

router.put('/complete/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id)
    todo.complete = !todo.complete
    todo.save()

    res.json(todo)
    }
)

router.put('/update/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)
  todo.text = req.body.text
  todo.save()

  res.json(todo)
  }
)


module.exports = router;