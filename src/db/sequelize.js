const { Sequelize, DataTypes } = require('sequelize')
const users = require('./db-users')
const UserModel = require('../models/users')
const bcrypt = require('bcrypt')


let sequelize;
if (process.env.NODE_ENV === 'production') {
    const database = 'Morpion'
    const host = 'nom'
    const password = 'Mdp'
    
    
    sequelize = new Sequelize(database, host, password, {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
    })
}
else {
    const database = 'Morpion'
    const host = 'root'
    const password = ''
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