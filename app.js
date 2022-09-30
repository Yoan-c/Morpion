const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const sequelize = require('./src/db/sequelize')
const bodyParser = require('body-parser')
const path = require('path')
const userSocket = require('./src/socket/userSocket')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const publicPath = path.join(__dirname, 'public')

app.use(bodyParser.json())
    .use(express.static(publicPath))

const port = process.env.PORT || 3000


sequelize.initDb()


io.on('connection', (socket) => {
    console.log(`NEW WS CONNECTION ${userSocket.users}`)

    socket.emit('message', "WELCOME")
    socket.on('play', (data) => {
        console.log(`RECU du client ${data.tabGame}`)
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


server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


