const path = require('path')

module.exports = (app) => {
    app.get('/', (req, res) => {
        console.log(path)
        res.sendFile(path.join(__dirname, '../../public', 'index.html'))
    })
}