const checkGame = require('../../functions/checkGame')

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function IAGame(tabGameSocket, data, user) {
    let res = ""
    if (user.isEnd === false) {
        res = checkGame.checkTab(tabGameSocket, data, user)

        if (res && res.win === false && res.end === false) {
            user.isMyTurn = false
            if (user.level === 1) {
                let position = getRandomInt(9)

                while (res.tabGame[position] !== false) {
                    position = getRandomInt(9)
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
                // calcul
            }
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