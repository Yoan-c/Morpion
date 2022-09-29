const jwt = require('jsonwebtoken');
const statusCode = require('../config/status')
const verifyToken = require('../middleware/verifyToken')

module.exports = (app) => {
    app.get('/games', verifyToken, (req, res) => {

        data = 'ici dans le jeux'
        res.status(statusCode.OK).json({ data })

    })
}