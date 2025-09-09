const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if(!authorization) {
            return res.status(401).json({
                success: false,
                error: 'Token Not Found'
            })
        }

        const token = authorization.split(' ')[1];

        if(!token) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            success: false,
            error: 'Unauthorized'
        })
    }
}

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '30d'});
}

module.exports = {
    jwtAuthMiddleware,
    generateToken,
}