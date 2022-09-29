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

app.get('/vsia', (req, res) => {
    res.sendFile(__dirname + '/public/morpion.html');
});
io.on('connection', (socket) => {
    console.log(`NEW WS CONNECTION ${userSocket.users}`)

    socket.emit('message', "WELCOME")

})

// route
require('./src/root/login')(app, io)
require('./src/root/index')(app)
require('./src/root/games')(app)


server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


