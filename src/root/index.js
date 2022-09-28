module.exports = (app) => {
    app.get('/', (req, res) => {
        console.log('route entree')
        res.json('Hello world tessst ')
    })
}