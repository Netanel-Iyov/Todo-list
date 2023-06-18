const jwt = require('jsonwebtoken');

exports.jwtAuth = (req, res, next) => {
    token = req.body.token

    try {
        // .env
        const user = jwt.verify(token, 'your_secret_key')

        req.user = user
        next()

    } catch(err) {
        return res.redirect("/")
    }
}