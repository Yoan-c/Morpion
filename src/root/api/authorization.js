const statusCode = require('../../config/status')
const verifyToken = require('../../middleware/verifyToken')

module.exports = (app) => {
    app.post('/authorization', verifyToken, (req, res) => {
        data = true
        res.status(statusCode.OK).json({ data })
    })
}