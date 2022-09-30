let users = []

function addUserSocket(id, user, isConnected) {
    data = {
        id,
        name: user.username,
        isConnected
    }
    users = [...users, { data }]
    return users
}

module.exports = {
    users, addUserSocket
}