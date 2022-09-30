const { userModel } = require('../../db/sequelize')
const bcrypt = require('bcrypt')
const userSocket = require('../../socket/userSocket')
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
                    console.log(`User found ${user.password}`)
                    bcrypt.compare(password, user.password)
                        .then(result => {
                            if (result) {
                                const token = jwt.sign({ name: user.username }, pkey, { expiresIn: '1h' })
                                console.log(`User autorisé ${token}`)
                                user.isConnected = true
                                user.update({ isConnected: true }, { where: { username: user.username } })
                                userSocket.users = userSocket.addUserSocket(1, user, true)
                                dataSend.status = status.OK
                                dataSend.data = { token }
                                res.status(status.OK).json({ dataSend })
                                //       return

                            }
                            else {
                                console.log(`User pas autorisé `)
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