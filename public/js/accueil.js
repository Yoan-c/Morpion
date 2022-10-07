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
    let userConnect

    if (!token) {
        redirectConnect()
        return
    }
    const socket = io();
    ask(token, 'authorization')
        .then(result => {
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
        let modalUser = document.getElementById('modal-users')
        let modalRules = document.getElementById('modal-rules')
        console.log(`fermer ${JSON.stringify(modalUser)}`)
        modalUser.innerHTML = ""
        modalUser.style.display = 'none'
        if (modalRules)
            modalRules.style.display = 'block'
    }
    defiPlayer.onclick = () => {

        askUserConnect();
    }

    function askUserConnect() {
        console.log(`envoi une demande de liste`)
        socket.emit('askPlayers', token)
    }
    socket.on('showPlayers', players => {
        userConnect = players
        showUserConnect(players)
    })

    function showUserConnect(dataUser) {
        let modalRules = document.getElementById('modal-rules')
        let modalUsers = document.getElementById('modal-users')
        modalUsers.style.display = 'flex'
        modalRules.style.display = 'none'
        for (let i = 0; i < dataUser.length; i++) {
            let divLineUser = document.createElement('div')
            divLineUser.setAttribute('class', 'lineUser')
            let divIsCo = document.createElement('div')
            divIsCo.setAttribute('class', (dataUser[i].isConnected) ? 'connected' : 'notConnected')
            divIsCo.setAttribute('class', (dataUser[i].isInGame) ? 'busy' : divIsCo.getAttribute('class'))
            let p = document.createElement('p')
            p.textContent = dataUser[i].name
            p.style.cursor = (dataUser[i].isConnected) ? "pointer" : "not-allowed"
            p.style.cursor = (dataUser[i].isInGame) ? "not-allowed" : "pointer"
            p.onclick = () => {
                socket.emit('askPlayWithPlayer', { token, vs: dataUser[i].name })
            }
            divLineUser.appendChild(divIsCo)
            divLineUser.appendChild(p)
            modalUsers.appendChild(divLineUser)
        }
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
    socket.on('choiceSign', _ => {
        let modalUser = document.getElementById('modal-users')
        let btnX = document.createElement('div')
        let btnO = document.createElement('div')
        btnX.id = 'X'
        btnO.id = 'O'
        btnX.innerHTML = "Voulez vous choisir les <span id='choiceX'>X</span> ?"
        btnO.innerHTML = "Voulez vous choisir les <span id='choiceO'>O</span> ?"
        btnX.onclick = () => { choiceSignPlayer('X') }
        btnO.onclick = () => { choiceSignPlayer('O') }
        modalUser.innerHTML = ""
        modalUser.style.width = "auto"
        modalUser.appendChild(btnX)
        modalUser.appendChild(btnO)

    })
    function choiceSignPlayer(choice) {
        socket.emit('choiceSignPlayer', { token, choice })
    }

    socket.on('message', data => {
        console.log(`RECU message serveur ${data}`)
    })
    socket.on('askChallenge', dataChallenger => {

        console.log(`challenger ${JSON.stringify(dataChallenger)}`)
        let modalBody = document.getElementById('modal-body')
        let modalRules = document.getElementById('modal-rules')
        let modalUser = document.getElementById('modal-users')
        let modalClose = document.getElementById('modal-close')
        let btnAccept = document.createElement('button')
        let btnRefuse = document.createElement('button')

        let p = document.createElement('p')
        p.setAttribute('class', 'askChallengeName')
        p.textContent = `${dataChallenger.name} vous défie`
        btnAccept.innerHTML = "Accepter"
        btnAccept.onclick = () => { acceptChallenge({ 'confirm': 'accept', 'name': dataChallenger.name }) }
        btnRefuse.onclick = () => { acceptChallenge({ 'confirm': 'refuse', 'name': dataChallenger.name }) }
        btnRefuse.innerHTML = "Refuser"
        btnAccept.setAttribute("class", "btn btn-accept")
        btnRefuse.setAttribute("class", "btn btn-refuse")
        if (modalRules)
            modalBody.removeChild(modalRules)
        modalUser.appendChild(btnAccept)
        if (modalClose)
            modalBody.removeChild(modalClose)
        modalUser.appendChild(p)
        modalUser.appendChild(btnAccept)
        modalUser.appendChild(btnRefuse)
        modalUser.style.justifyContent = "space-evenly"
        modalUser.style.margin = "0 auto"
        modalUser.style.display = "flex"
        modal.style.display = "flex"
    })
    let acceptChallenge = (opt) => {
        socket.emit('acceptChallenge', { token, opt })
    }
    socket.on(`challengerWaiting`, askChallenger => {
        console.log(`attente de la réponse de ${JSON.stringify(askChallenger)}`)
    })
    socket.on(`startGame`, _ => {
        console.log(`Redirection vers page morpion `)
    })
    socket.on(`cancelChallenge`, data => {
        if (data && data.name) {
            let modalUser = document.getElementById('modal-users')
            modalUser.innerHTML = `${data.name} a refusé le défie <a class='linkRefuse' href='/accueil'> Cliquez ici pour revenir à l'acceuil </a>`
        }
        else {
            document.location.href = "/accueil"
        }
        console.log(`Reset des user `)
        //socket.emit('reset', { token })
    })


}