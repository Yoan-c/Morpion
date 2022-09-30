const statusCode = require('../../config/status')
const verifyToken = require('../../middleware/verifyToken')
const checkToken = require('../../functions/checkToken')

module.exports = (app) => {
    app.post('/authorization', verifyToken, (req, res) => {

        checkToken(req.token)
            .then(data => {
                res.status(statusCode.OK).json({ data })
            })
            .catch(err => {
                res.status(statusCode.UNAUTORIZED).json({ err })
            })

    })
}