const { Sequelize, DataTypes } = require('sequelize')
const users = require('./db-users')
const UserModel = require('../models/users')
const bcrypt = require('bcrypt')

const database = 'Morpion'
const host = 'root'
const password = ''
const sequelize = new Sequelize(database, host, password, {
    host: 'localhost',
    dialect: 'mariadb',
    logging: (log) => {
        console.log("db LOG " + log)
    }
})

const userModel = UserModel(sequelize, DataTypes)

const initDb = () => {
    sequelize.sync({ force: true })
        .then(data => {
            users.map(user => {
                bcrypt.hash(user.password, 10, (err, hash) => {
                    userModel.create({
                        username: user.username,
                        password: hash
                    })
                })

            })
            console.log("base de donnée synchronisée et initialisée")
        })
}


module.exports = {
    initDb, userModel
}