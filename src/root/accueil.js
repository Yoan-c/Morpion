const path = require('path')

module.exports = (app) => {
    app.get('/accueil', (req, res) => {
        console.log(path)
        res.sendFile(path.join(__dirname, '../../public', 'accueil.html'))
    })
}