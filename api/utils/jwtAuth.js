const jwt = require('jsonwebtoken');

exports.jwtAuth = (req, res, next) => {
    token = req.body.token

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.user = user
        next()

    } catch(err) {
        return res.redirect("/")
    }
}