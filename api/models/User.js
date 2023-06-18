const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

const User = mongoose.model("User", UserSchema)

module.exports = User