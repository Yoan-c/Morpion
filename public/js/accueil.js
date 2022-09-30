window.onload = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        redirectConnect()
        return
    }
    const socket = io();
    ask(token, 'authorization')
        .then(result => {
            console.log(`test ${JSON.stringify(result)}`)
            socket.emit('inscritpion', token)
            // rajouter le socket inscritpion
            // retirer le chargement 
        })
        .catch(error => {
            console.log("errors")
            redirectConnect()
        })

}