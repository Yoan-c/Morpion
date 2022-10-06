const checkGame = require('../../functions/checkGame')

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
let randomPosition = (res) => {
    let position = getRandomInt(9)

    while (res.tabGame[position] !== false) {
        position = getRandomInt(9)
    }
    return position
}

let randomCaseNotAngle = () => {
    let tabRandomCase = [1,3,5,7]
    return tabRandomCase[getRandomInt(4)]
}

function IAGame(tabGameSocket, data, user) {
    let res = ""
    if (user.isEnd === false) {
        res = checkGame.checkTab(tabGameSocket, data, user)

        if (res && res.win === false && res.end === false) {
            user.isMyTurn = false
            let position = -1
            if (user.level === 1) {
                position = randomPosition(res)
            }
            else {
                // on vérifie si le user ou IA à presque gagné
                let almostWin = checkGame.checkMissinOneForWinChar(tabGameSocket.newTab, res.choiceVs)
                if (almostWin >= 0 )
                    position = almostWin
                else {
                    let almostWinAdv = checkGame.checkMissinOneForWinChar(tabGameSocket.newTab, user.choice)
                    if (almostWinAdv >= 0)
                        position = almostWinAdv
                    else {
                        // on vérifie le milieu
                            if (res.tabGame[4] === false)
                                position = 4
                            else {
                                if (res.tabGame[4] === res.choiceVs)
                                {
                                    if ((res.tabGame[0] !== false && res.tabGame[0] === res.tabGame[8]) ||
                                        (res.tabGame[2] !== false && res.tabGame[2] === res.tabGame[6])) {
                                            position = randomCaseNotAngle()
                                        }
                                        else 
                                            position = randomPosition(res)
                                }
                                else 
                                    position = randomPosition(res)
                            }
                    }
                }
            }
            data.position = position + 1
            if (res.tabGame[position] === false)
                res.tabGame[position] = true
            data.tabGame = res.tabGame
            res = checkGame.checkTab(tabGameSocket, data, user)
            if (res.win)
                res.name = "IA"
        }
        else {
            res.name = user.name
        }
    }
    return res

}

module.exports = {
    IAGame
}