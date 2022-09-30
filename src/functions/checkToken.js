const privateKey = require('../models/customKey')
const { userModel } = require('../db/sequelize')
const jwt = require('jsonwebtoken')

const checkToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, privateKey, function (err, decoded) {
            if (err) {
                reject(err)
                return
            }
            else {
                let name = decoded.name
                userModel.findOne({
                    where: {
                        username: name
                    }
                })
                    .then(user => {
                        let data = {
                            username: "",
                            isConnected: false,
                            updateAt: 0
                        }
                        if (user && user.isConnected) {
                            data.username = user.username
                            data.isConnected = user.isConnected
                            data.updateAt = user.updateAt
                            resolve(data)
                        }
                        else {
                            resolve(data)
                        }
                    })
                    .catch(err => {
                        reject(err)
                    })

            }
        })
    })
}

module.exports = checkToken