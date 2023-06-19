const jwt = require('jsonwebtoken');

exports.jwtAuth = (req, res, next) => {
    token = req.body.token
    
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.user = user
        next()

    } catch(err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json(err);
        } else {
            return res.status(400).json(err);
        }
    }
}