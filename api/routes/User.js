const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken');

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

router.post('/login', async (req, res) => {  
  const email = req.body.email
  const password = req.body.password

  try {
        const user = await User.findOne({email: email});

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        if (password !== user.password) {
          return res.status(401).json({ error: 'Incorrect password' })
        }

        // User validated successfully
        // Generate and send the JWT token as a response
        const token = generateToken(user)
        res.status(200)
        res.json({token})

      } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'An error occurred while accessing the database', 
                                          errorDetails: error})
    }
})

const generateToken = (user) => {
    const userData = { id: user._id, email: user.email, password:user.password }
    // .env
    const token = jwt.sign(userData, 'your_secret_key', {expiresIn: '1h'});
    return token;
} 

module.exports = router;