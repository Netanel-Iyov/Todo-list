const express = require('express')
const router = express.Router()

const User = require('../models/User')

router.post('/new', async (req, res) => {  
    try {
        const user = new User({
          email: req.body.email,
          password: req.body.password
        });
    
        const savedUser = await user.save();
        res.json(savedUser);
      } catch (error) {
        if (error.name === 'ValidationError') {
          res.status(400).json(error);
        } else {
          res.status(500).json({ error: 'An error occurred' });
        }
    }
})

router.get('/get', async (req, res) => {  
    try {
        const user = await User.findOne({email: req.body.email, password: req.body.password});

        if (user == null) {
            res.json({ _id: 'Not Found' })
        }

        else {
            res.json(user)
        }
        
      } catch (error) {
            console.log(error)
            res.status(400).json(error);
    }
})


module.exports = router;