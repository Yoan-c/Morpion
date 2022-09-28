const jwt = require('jsonwebtoken');
const statusCode = require('../config/status')
const verifyToken = require('../middleware/verifyToken')

module.exports = (app) => {
    app.get('/games', verifyToken, (req, res) => {

        console.log("entrer dans le jeux")
        data = 'ici dans le jeux'
        res.status(statusCode.OK).json({ data })

    })
}