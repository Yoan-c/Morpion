
const tabGSocket = require('../socket/tabGameSocket')
const tabWinCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

function checkTab(tabGameSocket, data, user) {
    let { position, tabGame } = data
    let res = {
        win: false,
        name: "",
        tabGame,
        position: 0,
        choice: "X",
        choiceVs: (user.choice === "X") ? "O" : "X",
        username : user.name,
        end: true
    }
    position -= 1
    if (checkChangementTab(tabGameSocket.newTab, tabGame, position) === 1) {
        if (position >= 0 && tabGame && tabGame[position]) {
            let choice = res.choice
            if (user.isMyTurn)
                choice = (user.choice === "X") ? "X" : "O"
            else
                choice = (user.choice === "X") ? "O" : "X"
            res.position = data.position
            res.choice = choice
            tabGame[position] = choice
            tabGameSocket.newTab[position] = choice
            let tabNow = {
                id: user.idTab,
                newTab: tabGameSocket.newTab
            }
            tabGSocket.modifTabSocket(tabNow)
            tabGameSocket = tabGSocket.searchtabGameSocket(user.idTab)
            res.win = checkWin(tabGameSocket.newTab)
            if (!res.win)
                res.end = checkEnd(tabGameSocket.newTab)
            res.tabGame = [...tabGameSocket.newTab]
        }
        else
            console.log(`[checkGame] erreur checkTabGame ${position} tabgame ${JSON.stringify(tabGame)}`)

    }
    else {
        console.log(`[checkGame] Erreur client`)
    }
    return res;
}

function checkChangementTab(currentTab, newTab, position) {
    let count = 0
    for (let i = 0; i < currentTab.length; i++) {
        if (currentTab[i] !== newTab[i]) {
            if (currentTab[i] === false && newTab[i] === true && i === position) {
                count++
            }
        }
    }
    return count
}

function checkWin(currentTab) {

    for (let i = 0; i < tabWinCondition.length; i++) {
        if (currentTab[tabWinCondition[i][0]] === currentTab[tabWinCondition[i][1]] &&
            currentTab[tabWinCondition[i][1]] === currentTab[tabWinCondition[i][2]] &&
            currentTab[tabWinCondition[i][0]] !== false) {
            return true
        }
    }
    return false
}

function checkMissinOneForWinChar(currentTab, sign) {

    for (let i = 0; i < tabWinCondition.length; i++) {
        if (currentTab[tabWinCondition[i][0]] === sign &&
            currentTab[tabWinCondition[i][0]] === currentTab[tabWinCondition[i][1]] &&
            currentTab[tabWinCondition[i][2]] === false) {
            return tabWinCondition[i][2]
        }
        else if (currentTab[tabWinCondition[i][0]] === sign &&
            currentTab[tabWinCondition[i][0]] === currentTab[tabWinCondition[i][2]] &&
            currentTab[tabWinCondition[i][1]] === false) {
            return tabWinCondition[i][1]
        }
        else if (currentTab[tabWinCondition[i][1]] === sign &&
            currentTab[tabWinCondition[i][1]] === currentTab[tabWinCondition[i][2]] &&
            currentTab[tabWinCondition[i][0]] === false) {
            return tabWinCondition[i][0]
        }
    }
    return -1
}

function checkEnd(currentTab) {
    for (let i = 0; i < currentTab.length; i++) {
        if (currentTab[i] === false)
            return false

    }
    return true
}

module.exports = {
    checkTab, checkMissinOneForWinChar
}