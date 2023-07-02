const jwt = require('jsonwebtoken')

/**
 * Middleware function for JWT authentication.
 * Verifies the provided token and attaches the user object to the request object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.jwtAuth = (req, res, next) => {
    token = req.body.token // Extract the token from the request body

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY) // Verify the token using the JWT_SECRET_KEY

        req.user = user // Attach the user object to the request object
        next() // Call the next middleware function

    } catch(err) {
        if (err.name === 'TokenExpiredError') {
            // Return a 401 Unauthorized status if the token has expired
            return res.status(401).json(err)
        } else {
            // Return a 400 Bad Request status for any other errors
            return res.status(400).json(err)
        }
    }
}
