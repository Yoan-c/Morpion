const { userModel } = require('../../db/sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pkey = require('../../models/customKey')
const status = require('../../config/status')

module.exports = (app) => {
    let dataSend = {
        status: 200,
        data: {}
    };
    app.post('/login', (req, res) => {
        const username = req.body.username
        const password = req.body.password
        if (username == null || password == null) {
            dataSend.data = { message: 'Veuillez verifiez votre login et mot de passe' }
            res.status(status.UNAUTHENTICATED).json({ dataSend })
            return;
        }
        userModel.findOne({ where: { username: username } })
            .then(user => {
                if (user) {
                    bcrypt.compare(password, user.password)
                        .then(result => {
                            if (result) {
                                const token = jwt.sign({ name: user.username }, pkey, { expiresIn: '1h' })
                                user.isConnected = true
                                user.update({ isConnected: true }, { where: { username: user.username } })
                                dataSend.status = status.OK
                                dataSend.data = { token }
                                res.status(status.OK).json({ dataSend })
                            }
                            else {
                                dataSend.status = status.UNAUTORIZED
                                dataSend.data = { message: `Veuillez verifier votre login et mot de passe` }
                                res.status(status.UNAUTORIZED).json({ dataSend })
                            }
                        })
                }
                else {
                    dataSend.status = status.UNAUTORIZED
                    dataSend.data = { message: "Veuillez verifier votre login et mot de passe " }
                    res.status(status.UNAUTORIZED).json({ dataSend })
                }
            })
    })
}