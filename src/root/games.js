const path = require('path')

module.exports = (app) => {
    app.get('/morpion', (req, res) => {
        res.sendFile(path.join(__dirname, '../../public', 'morpion.html'))
    })
}