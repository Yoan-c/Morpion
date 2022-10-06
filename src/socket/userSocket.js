let users = []

function addUserSocket(id, name, isConnected, updatedAt, level) {

    let searchUser = users.find(user => user.name == name)

    if (!searchUser) {
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
    }
    else {
        searchUser.isConnected = true
       modifUser(searchUser)
    }
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
/*
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
*/
function modifUser(user) {
    return users.find(userData => {
        if (userData.name == user.name) {
            userData.level = (user.level) ?user.level : userData.level
            userData.room = (user.room) ? user.room : userData.room
            userData.choice = (user.choice) ? user.choice : userData.choice
            userData.versus = (user.versus) ? user.versus : userData.versus
            userData.isMyTurn = (user.isMyTurn) ? user.isMyTurn : userData.isMyTurn
            userData.idTab = (user.idTab) ? user.idTab : userData.idTab 
            userData.isEnd = (user.isEnd) ? user.isEnd : userData.isEnd
            userData.isConnected = (user.isConnected) ? user.isConnected : userData.isConnected
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