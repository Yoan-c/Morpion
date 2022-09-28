const statusCode = require('../config/status')
const privateKey = require('../models/customKey')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const baererHeader = req.headers['authorization']
    if (typeof baererHeader !== 'undefined') {
        const baerer = baererHeader.split(' ')
        const token = baerer[1]
        req.token = token
        jwt.verify(token, privateKey, function (err, decoded) {
            if (err) {
                const datas = {
                    status: statusCode.UNAUTORIZED,
                    data: {
                        message: "Veuillez vous identifier"
                    }
                }
                res.status(statusCode.UNAUTORIZED).json({ datas })
                return
            }
            else {
                next()
            }
        })
        /*  jwt.verify(token, pkey);
                        message = {
                            token: token
                        }*/
        //  res.setHeader('bearer', token)

    }
    else {
        const datas = {
            status: statusCode.UNAUTORIZED,
            data: {
                message: "Veuillez vous identifier"
            }
        }
        res.status(statusCode.UNAUTORIZED).json({ datas })
    }
}

module.exports = verifyToken