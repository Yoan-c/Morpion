const statusCode = require('../../config/status')
const verifyToken = require('../../middleware/verifyToken')
const { userModel } = require('../../db/sequelize')

module.exports = (app) => {
    app.post('/deconnexion', verifyToken, (req, res) => {
        data = true
        console.log(`name user ${req.name}`)
        userModel.findOne({
            where: {
                username: req.name
            }
        })
            .then(user => {
                if (user) {
                    user.isConnected = false
                    user.update({ isConnected: false }, { where: { username: req.name } })
                }
            })
        res.status(statusCode.OK).json({ data })
    })
}