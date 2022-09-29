const socket = io();

socket.on('message', msg => {
    console.log(`message serveur ${msg}`)
})