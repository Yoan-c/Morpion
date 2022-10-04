let users = []

function addUserSocket(id, name, isConnected, updatedAt, level) {

    let searchUser = users.find(user => user.name == name)

    if (!searchUser)
        users = [...users, {
            id,
            name,
            isConnected,
            updatedAt,
            level,
            room: "",
            choice: "",
            versus: "",
            isMyTurn: false,
            idTab: "",
            isEnd: false
        }]
    return users
}

function modifConnect(name, level) {
    users.find(user => {
        if (user.name == name)
            user.isConnected = false
        if (level)
            user.level = level
    })
}

function modifUser(user) {
    return users.find(userData => {
        if (userData.name == user.name) {
            userData.level = user.level
            userData.room = user.room
            userData.choice = user.choice
            userData.versus = user.versus
            userData.isMyTurn = user.isMyTurn
            userData.idTab = user.idTab
            userData.isEnd = user.isEnd
        }
    })
}

function searchUserSocket(name) {
    return users.find(user => user.name == name)
}

function resetUser(user) {
    user.room = ""
    user.choice = ""
    user.versus = ""
    user.idTab = ""
    user.isMyTurn = false
    user.isEnd = false
    return user
}

module.exports = {
    users, addUserSocket, modifConnect, searchUserSocket, modifUser, resetUser
}