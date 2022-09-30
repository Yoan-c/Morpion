let users = []

function addUserSocket(id, name, isConnected, updateAt) {
    let data = {
        id,
        name,
        isConnected,
        updateAt,
    }
    let searchUser = users.find(user => user.name == name)

    if (!searchUser)
        users = [...users, { id, name, isConnected, updateAt }]
    console.log(`user mis ${searchUser}`)
    return users
}

function modifConnect(name) {
    users.find(user => {
        if (user.name == name)
            user.isConnected = false
    })
}

module.exports = {
    users, addUserSocket, modifConnect
}