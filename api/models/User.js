
const { hashPassword } = require('../utils/utils') // JWT authentication middleware
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define the schema for the User model
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: [true, "Email must be unique"]
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    default: Date.now()
  }
})

// middleware for mongoose - save hashed passwords in the database
UserSchema.pre('save', async function (next) {
  try {
    const hashedPassword = hashPassword(this.password)
    this.password = hashedPassword
    next()
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// Create the User model using the UserSchema
const User = mongoose.model("User", UserSchema)

module.exports = User
