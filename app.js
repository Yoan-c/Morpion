const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const sequelize = require('./src/db/sequelize')
const bodyParser = require('body-parser')
const path = require('path')
const userSocket = require('./src/socket/userSocket')
const tabSocket = require('./src/socket/tabGameSocket')
const checkToken = require('./src/functions/checkToken')
const checkGame = require('./src/functions/checkGame')
const IAGame = require('./src/game/IA/IA')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const publicPath = path.join(__dirname, 'public')

app.use(bodyParser.json())
    .use(express.static(publicPath))

const port = process.env.PORT || 3000


sequelize.initDb()


io.on('connection', (socket) => {
    console.log(`NEW WS CONNECTION ${socket.id}`)


    socket.on('loadGame', (data) => {
        checkToken(data.token)
            .then(res => {
                let tab = []
                for (let i = 0; i < 9; i++)
                    tab.push(false)
                let user = userSocket.searchUserSocket(res.username)
                // SERT A RIEN peut etre plus tard pour savoir qui a quitter la partie 
                // pas oublier de save le user pour que ca soit pris en compte
                user.id = socket.id
                socket.join(user.room)
                tabSocket.addtabGameSocket(user.room, tab, tab)
                user.idTab = user.room
                userSocket.modifUser(user)
                io.to(user.id).emit("loadGame", { choice: user.choice, isMyTurn: user.isMyTurn, versus: user.versus })
            })
            .catch(err => {
                console.log(`erreur loadGame ${err}`)
            })
    })

    socket.on('play', (data) => {
        checkToken(data.token)
            .then(res => {
                let user = userSocket.searchUserSocket(res.username)
                let userVersus = userSocket.searchUserSocket(user.versus)
                let tabGame = tabSocket.searchtabGameSocket(user.idTab)
                if (data.versus === "IA") {
                    user.IsInGame = true
                    userSocket.modifUser(user)
                    if (tabGame) {
                        res = IAGame.IAGame(tabGame, data, user)
                        if (res) {
                            if (res.win || res.end) {
                                io.to(user.room).emit('endGame', { res, username: user.name })
                            }
                            else {
                                user.isMyTurn = true
                                res.isMyTurn = true
                                io.to(user.room).emit('play', res)
                            }
                        }
                        else {
                            let msg = "Une erreur est survenue"
                            io.to(user.room).emit('error_game', { msg })
                        }
                    }
                    else {
                        console.log('non trouvwe')
                    }
                }
                else {
                    res = checkGame.checkTab(tabGame, data, user)
                    user.isMyTurn = false
                    userVersus.isMyTurn = true
                    userSocket.modifUser(user)
                    userSocket.modifUser(userVersus)
                    userVersus = userSocket.searchUserSocket(data.versus)
                    res.isMyTurn = user.isMyTurn
                    if (res.win || res.end) {
                        res.name = user.name 
                        userSocket.modifUser(user)
                        userSocket.modifUser(userVersus)
                        io.to(user.id).emit('endGame', { res, username: user.name})
                        io.to(userVersus.id).emit('endGame', { res, username: userVersus.name})
                    }
                    else {
                        socket.to(user.id).emit("play", res)
                        res.isMyTurn = userVersus.isMyTurn
                        socket.to(userVersus.id).emit("play", res)
                    }
                }
            })
            .catch(err => {
                console.log(`erreur play ${err}`)
            })
    })

    socket.on('inscritpion', (token) => {
        checkToken(token)
            .then(data => {
                if (data.isConnected)
                    userSocket.users = userSocket.addUserSocket(socket.id, data.username, data.isConnected, data.updatedAt, 1)
                let tabUserSign = userSocket.users.map(user => { return { name: user.name, isConnected: user.isConnected } })
                tabUserSign = tabUserSign.filter(user => user.name !== data.username)
                io.emit('players', tabUserSign)
            })
            .catch(err => {
                console.log(`erreur Inscription ${err}`)
            })

    })
    socket.on('askPlayers', (token) => {
        checkToken(token)
            .then(data => {
                let tabUserSign = userSocket.users.map(user => { return { name: user.name, isConnected: user.isConnected, isInGame: user.IsInGame } })
                tabUserSign = tabUserSign.filter(user => user.name !== data.username)
                socket.emit('showPlayers', tabUserSign)
            })
            .catch(err => {
                console.log(`erreur askPlayers ${err}`)
            })
    })

    socket.on("IA", data => {

        checkToken(data.token)
            .then(res => {
                let user = userSocket.searchUserSocket(res.username)
                user.room = `${user.name}_IA`
                if (data.choice) {
                    user.choice = data.choice
                }
                if (data.level)
                    user.level = data.level
                if (data.versus) {
                    user.versus = "IA"
                    user.isMyTurn = true
                }
                userSocket.modifUser(user)
            })
            .catch(err => {
                console.log(`erreur socket IA ${err}`)
            })
    })
    socket.on("reset", data => {
        checkToken(data.token)
            .then(res => {
                let user = userSocket.searchUserSocket(res.username)
                let room = user.room
                user.IsInGame = false
                user = userSocket.resetUser(user)
                user.room = room
                user.idTab = room
                let tab = tabSocket.searchtabGameSocket(user.idTab)
                tab = tabSocket.resetTab(tab)

            })
            .catch(err => {
                console.log(`erreur socket RESET ${err}`)
            })
    })
    socket.on('askPlayWithPlayer', askDataPlay => {
        checkToken(askDataPlay.token)
            .then(res => {
                let user = userSocket.searchUserSocket(res.username)
                let userVs = userSocket.searchUserSocket(askDataPlay.vs)
                if (userVs) {
                    let room = `${user.name}_${userVs.name}`
                    user.room = room
                    user.versus = userVs.name
                    user.isMyTurn = true
                    user.idTab = room
                    userVs.room = room
                    userVs.versus = user.name
                    userVs.isMyTurn = false
                    userVs.idTab = room
                    io.to(socket.id).emit('choiceSign')
                    io.to(userVs.id).emit('askChallenge', { name: user.name })

                }
                else {
                    console.log(`erreur askPlayWithPlayer : Aucun players found`)
                    // envoi socket erreur
                }
            })
            .catch(err => {
                console.log(`erreur askPlayWithPlayer ${err}`)
            })
    })
    socket.on('choiceSignPlayer', dataChoicePlayer => {
        checkToken(dataChoicePlayer.token)
            .then(res => {
                let user = userSocket.searchUserSocket(res.username)
                let userVs = userSocket.searchUserSocket(user.versus)
                if (userVs) {
                    user.choice = (dataChoicePlayer.choice === 'X') ? 'X' : 'O'
                    userVs.choice = (user.choice === 'X') ? 'O' : 'X'
                    user.isReady = true
                    userSocket.modifUser(user)
                    userSocket.modifUser(userVs)
                    socket.join(user.room)
                    io.to(user.room).emit('startGame', {isReady : userVs.isReady})
                }
                else {
                    console.log(`erreur choiceSignPlayer : Aucun players found`)
                    // envoi socket erreur
                }
            })
            .catch(err => {
                console.log(`erreur choiceSignPlayer ${err}`)
            })
    })
    socket.on('acceptChallenge', data => {
        checkToken(data.token)
            .then(res => {
                let user = userSocket.searchUserSocket(res.username)
                let userVs = userSocket.searchUserSocket(user.versus)
                if (data.opt.confirm === 'accept') {
                    socket.join(user.room)
                    user.isReady = true
                    userSocket.modifUser(user)
                    if (userVs) {
                        io.to(user.room).emit('startGame', { isReady : userVs.isReady })
                    }
                    else {
                        console.log(`erreur acceptChallenge : Aucun players found`)
                        // envoi socket erreur
                    }
                }
                else {
                    userSocket.resetUser(user)
                    userSocket.resetUser(userVs)
                    io.to(userVs.id).emit('cancelChallenge', { name: user.name })
                    io.to(user.id).emit('cancelChallenge')

                }
            })
            .catch(err => {
                console.log(`erreur acceptChallenge ${err}`)
            })
    })

})

// route
require('./src/root/api/login')(app)
require('./src/root/api/games')(app)
require('./src/root/api/authorization')(app)
require('./src/root/api/deconnexion')(app)
require('./src/root/api/create')(app)
require('./src/root/accueil')(app)
require('./src/root/index')(app)
require('./src/root/games')(app)


server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


