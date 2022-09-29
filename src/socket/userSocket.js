let users = []

function addUserSocket(id, user) {
    data = {
        id,
        name: user.username
    }
    users = [...users, { data }]
    return users
}

module.exports = {
    users, addUserSocket
}