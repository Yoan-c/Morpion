//const { Sequelize, DataTypes } = require('sequelize')

const userModel = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Un utilisateur avec le même nom existe déjà'
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}

module.exports = userModel