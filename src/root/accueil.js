const path = require('path')

module.exports = (app) => {
    app.get('/accueil', (req, res) => {
        res.sendFile(path.join(__dirname, '../../public', 'accueil.html'))
    })
}