const { userModel } = require('../../db/sequelize')
const jwt = require('jsonwebtoken')
const pkey = require('../../models/customKey')
const statusCode = require('../../config/status')
const bcrypt = require('bcrypt')

module.exports = (app) => {
    app.post('/create', (req, res) => {

        let username = req.body.username
        let password = req.body.password
        let confirmPass = req.body.confirmation
        let dataSend = {
            status: 200,
            data: {
                token: "",
                msg: "",
            }
        }

        if (!username || !password || !confirmPass || password !== confirmPass) {
            dataSend.status = statusCode.BADREQUEST
            dataSend.data.msg = "Veuillez verifier les différents champs et que les deux mots de passe soient identique"
            res.status(statusCode.BADREQUEST).json({ dataSend })
        }
        else {
            bcrypt.hash(password, 10, (err, hash) => {
                userModel.create({
                    username,
                    password: hash,
                    isConnected: true,
                }).then(user => {
                    const token = jwt.sign({ name: user.username }, pkey, { expiresIn: '1h' })
                    dataSend.data.token = token
                    dataSend.data.msg = "Utilisateur crée"
                    res.json({ dataSend })
                })
                    .catch(err => {
                        dataSend.status = statusCode.UNAUTHENTICATED
                        if (err && err.errors)
                            dataSend.data.msg = err.errors[0].message
                        res.status(statusCode.UNAUTHENTICATED).json({ dataSend })
                    })
            })
        }

    })
}