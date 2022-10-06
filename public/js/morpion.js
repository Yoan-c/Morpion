window.onload = (e) => {
    const socket = io('http://localhost:3000');
    const token = localStorage.getItem("token");
    let chx = document.getElementById('choice')
    let defiName = document.getElementById('defiName')
    let modal = document.getElementById('modal')
    let modalClose = document.getElementById('modal-close')
    let quit = document.getElementById('quit')
    let defiIA = document.getElementById("defiIA")
    modalClose.onclick = () => {
        modal.style.display = 'none';
        
    }
    defiIA.onclick = () => {
        socket.emit('reset', { token })
        document.location.href = "/accueil"
    }
    quit.onclick = () => {
        socket.emit('reset', { token })
        document.location.href = "/accueil"
    }

    let tabCase = []
    if (!token) {
        redirectConnect()
        return
    }


    ask(token, 'authorization')
        .then(result => {
            data = { token }
            socket.emit('loadGame', data)
            socket.on('loadGame', (res) => {
                loadgame(res)
            })

        })
        .catch(error => {
            console.log("errors")
            redirectConnect()
        })


    function loadgame(dataGame) {
        chx.innerHTML = dataGame.choice
        let defiNameMsg = (dataGame.versus = "IA") ? `vous défiez l'${dataGame.versus}` : `Vous défiez ${dataGame.versus}`
        defiName.innerHTML = `${defiNameMsg} au Morpion`
        for (let i = 0; i < 9; i++) {
            let caseI = document.getElementById(`case_${i + 1}`)
            caseI.onclick = () => {
                clickArg(caseI, tabCase, dataGame)
            }
            let position = {
                caseI,
                isPlayed: false
            }
            tabCase.push(position)
        }
    }


    function clickArg(target, tabCase, dataGame) {
        let round = document.querySelector('#roundPlay');
        let canPlay = round.dataset.isRound;
        let position = target.id.split('_')[1]

        if (!target.innerHTML && canPlay == "1" && tabCase[position - 1].isPlayed == false) {
            target.innerHTML = dataGame.choice
            target.classList.add(`show${dataGame.choice}`)
            round.dataset.isRound = 0;
            tabCase[position - 1].isPlayed = true
            setPositionGame(position, tabCase, dataGame.versus)
        }
        else {
            console.log("deja coché ou pas votre tour")
        }
    }

    function setPositionGame(position, tabCase, versus) {
        let round = document.querySelector('#roundPlay');
        tabGame = tabCase.map(data => data.isPlayed)
        data = { position, tabGame, token, versus }
        socket.emit('play', data)
        round.innerHTML = `Au tour de ${versus}`

    }

    socket.on('play', msg => {
        let round = document.querySelector('#roundPlay');
        setTimeout(() => {
            if (msg.position && msg.choice) {
                let { position, choice } = msg
                console.log(`test ${position} et msg ${choice}`)
                document.getElementById(`case_${position}`).innerHTML = choice
                document.getElementById(`case_${position}`).setAttribute('class', `show${choice}`)
                round.innerHTML = `A votre tour`
                round.dataset.isRound = 1;
            }
        }, 1200)

    })
    socket.on('endGame', dataEnd => {
        let round = document.querySelector('#roundPlay');
        let endMsg = document.getElementById(`endMsg`)
        let msg
        if (dataEnd.res.win) {

            console.log(`message Fin de game win `)
            if (dataEnd.res.name === dataEnd.username) {
                msg = `Bravo vous avez gagné la parite`
                round.dataset.isRound = 0;
            }
            else
                msg = `Dommage vous avez perdu`

            endMsg.innerHTML = msg
        }
        else if (dataEnd.res.end) {
            endMsg.innerHTML = "Match NUL"
        }
        setTimeout(() => {
            modal.style.display = 'flex'
        }, 1500)
        
    })

    socket.on('players', players => {
        console.log(`Players ${JSON.stringify(players)}`)
    })

}










