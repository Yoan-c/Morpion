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
                msg: 'Un utilisateur avec le même pseudo existe déjà'
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isConnected: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })
}

module.exports = userModel