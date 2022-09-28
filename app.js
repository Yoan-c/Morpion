const express = require('express')
const sequelize = require('./src/db/sequelize')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

const port = 3000

sequelize.initDb()
// route
require('./src/root/index')(app)
require('./src/root/login')(app)
require('./src/root/games')(app)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})