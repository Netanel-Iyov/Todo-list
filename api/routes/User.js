const { compareHash } = require('../utils/utils') // JWT authentication middleware

const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken') // JSON Web Token library

const User = require('../models/User') // User model

/**
 * Route for creating a new user.
 */
router.post('/new', async (req, res) => {  
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.firstName,
      last_name: req.body.lastName
    })

    const savedUser = await user.save()
    res.json(savedUser)
  } catch (error) {
    console.log(error)

    if (error.name === 'ValidationError') {
      // Return a 400 Bad Request status if the user validation fails
      return res.status(400).json(error)
    } else if (error && error.code === 11000) {
      res.status(401).json(error)
    } else {
      // Return a 500 Internal Server Error status for any other errors
      return res.status(500).json({ error: 'An error occurred' })
    }
  }
})

/**
 * Route for user login.
 */
router.post('/login', async (req, res) => {  
  const email = req.body.email
  const password = req.body.password

  try {
    const user = await User.findOne({ email: { '$regex': email, $options: 'i' } })

    if (!user) {
      // Return a 404 Not Found status if the user is not found
      return res.status(404).json({ error: 'User not found' })
    }


    if (!compareHash(password, user.password)) {
      // Return a 401 Unauthorized status if the password is incorrect
      return res.status(401).json({ error: 'Incorrect password' })
    }

    // User validated successfully
    // Generate and send the JWT token as a response
    const token = generateToken(user)
    res.status(200)
    res.json({ token: token, first_name: user.first_name })

  } catch (error) {
    console.log(error)
    // Return a 500 Internal Server Error status for any database access errors
    return res.status(500).json({ error: 'An error occurred while accessing the database', errorDetails: error })
  }
})

/**
 * Generate a JSON Web Token (JWT) for the given user.
 * @param {Object} user - The user object for which the token will be generated.
 * @returns {string} - The generated JWT.
 */
const generateToken = (user) => {
  const userData = { id: user._id, email: user.email, password: user.password }
  const token = jwt.sign(userData, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
  return token
}

module.exports = router
