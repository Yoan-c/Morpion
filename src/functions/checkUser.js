const { sequelize } = require('../db/sequelize')

function checkDateUser(){

    sequelize.query(`DELETE FROM users WHERE id = (
        SELECT id 
        FROM users
        WHERE DATEDIFF(NOW() ,DATE(updatedAt)) > 6
        )`)
}

module.exports = {
    checkDateUser
}
