window.onload = () => {
    let defiIA = document.getElementById('defiIA')
    const token = localStorage.getItem("token");
    let modal = document.getElementById('modal');
    let modalClose = document.getElementById('modal-close')
    let btnEasy = document.getElementById('btnEasy')
    let btnHard = document.getElementById('btnHard')
    let X = document.getElementById('X')
    let O = document.getElementById('O')
    let choiceX = document.getElementById('choiceX')
    let choiceO = document.getElementById('choiceO')
    let isChoice = 0;
    let defiPlayer = document.getElementById('defiPlayer')

    if (!token) {
        redirectConnect()
        return
    }
    const socket = io('http://localhost:3000');
    ask(token, 'authorization')
        .then(result => {
            console.log(`test ${JSON.stringify(result)}`)
            socket.emit('inscritpion', token)
            // rajouter le socket inscritpion
            // retirer le chargement 
            defiIA.onclick = () => { modal.style.display = 'flex'; }
            btnEasy.onclick = () => { choiceLevel(1, socket) }
            btnHard.onclick = () => { choiceLevel(2, socket) }


        })
        .catch(error => {
            console.log("errors")
            redirectConnect()
        })
    modalClose.onclick = () => {
        modal.style.display = 'none';
    }
    defiPlayer.onclick =() => {
        let modalRules = document.getElementById('modal-rules')
        let modalUsers = document.getElementById('modal-users')
        modalRules.style.display = 'none'
        modalUsers.innerHTML = "afficher tout les users"
        modal.style.display = 'flex';
    }

    function choiceLevel(level, socket, choice) {
        let versus = "IA"
        let data = { level, token, choice, versus, isChoice }
        socket.emit('IA', data)
        if (isChoice === 1) {
            socket.emit('join_IA', token)
            document.location.href = "http://localhost:3000/morpion"
        } else {
            let modalRules = document.getElementById('modal-rules')
            modalRules.removeChild(btnEasy)
            modalRules.removeChild(btnHard)
            let chxX = document.createElement('div')
            chxX.id = 'X'
            chxX.innerHTML = "Voulez vous choisir les <span id='choiceX'>X</span> ?"
            let chxO = document.createElement('div')
            chxO.id = 'O'
            chxO.innerHTML = "Voulez vous choisir les <span id='choiceO'>O</span> ?"
            chxX.onclick = () => { choiceLevel(level, socket, "X") }
            chxO.onclick = () => { choiceLevel(level, socket, "O") }
            modalRules.appendChild(chxX)
            modalRules.appendChild(chxO)
            isChoice = 1
        }
    }

    socket.on('message', data => {
        console.log(`RECU message serveur ${data}`)
    })
    socket.on('players', players => {
        console.log(`Players ${JSON.stringify(players)}`)
    })
}