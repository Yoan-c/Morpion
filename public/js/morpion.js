window.onload = (e) => {
    const socket = io();
    const chx = document.getElementById('choice').innerHTML

    let tabCase = []

    for (let i = 0; i < 9; i++) {
        let caseI = document.getElementById(`case_${i + 1}`)
        caseI.onclick = () => {
            clickArg(caseI, chx)
        }
        let position = {
            caseI,
            isPlayed: false
        }
        tabCase.push(position)
    }

    function clickArg(target, chx) {
        console.log(`test ${target.id}`)
        let round = document.querySelector('#roundPlay');
        let canPlay = round.dataset.isRound;
        let position = target.id.split('_')[1]
        console.log(`position de la target ${position}`)
        if (!target.innerHTML && canPlay == "1" && tabCase[position - 1].isPlayed == false) {
            target.innerHTML = chx
            target.classList.add("showX")
            round.dataset.isRound = 0;
            tabCase[position - 1].isPlayed = true
            setPositionGame(position, tabCase)
            setTimeout(() => {
                round.innerHTML = "Au tour de l'IA"
            }, 1200)

        }
        else {
            console.log("deja coché ou pas votre tour")
        }
    }

    function setPositionGame(position, tabCase) {
        console.log("ENVOI SOCKET")
        tabGame = tabCase.map(data => data.isPlayed)
        socket.emit('play', { position, tabGame })
    }
}

/*
socket.on('message', msg => {
    console.log(`message serveur ${msg}`)
})
*/






