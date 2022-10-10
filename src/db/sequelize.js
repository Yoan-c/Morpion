const { Sequelize, DataTypes } = require('sequelize')
const users = require('./db-users')
const UserModel = require('../models/users')
const bcrypt = require('bcrypt')

const database = 'Morpion'
const host = 'root'
const password = ''

let sequelize;
if (process.env.NODE_ENV === 'production') {
    sequelize = new Sequelize(database, host, password, {
    host: 'localhost',
    dialect: 'mariadb',
    logging: true
    })
}
else {
    sequelize = new Sequelize(database, host, password, {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
})
}

const userModel = UserModel(sequelize, DataTypes)

const initDb = () => {
    return sequelize.sync()
        .then(data => {
            console.log("base de donnée synchronisée et initialisée")
        })
}


module.exports = {
    initDb, userModel, sequelize
}