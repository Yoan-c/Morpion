const btnAccept = document.getElementById('modal-accept')
const closeModal = document.getElementById('modal-close')
const loginLink = document.getElementById('login')
const signLink = document.getElementById('sign')
let connectForm = document.getElementById('login-form')
let createForm = document.getElementById('sign-form')
let submit = document.getElementById('submit')
let submitCreate = document.getElementById('submitCreate')
let msgInfo = document.getElementById('msgInfo')
let modal = document.getElementById('modal');
modal.style.display = 'flex';
const socket = io('http://localhost:3000');

const addModal = () => {
    let modal = document.getElementById('modal')
    modal.style.display = 'none'
}

closeModal.onclick = () => {
    addModal()
}

btnAccept.onclick = () => {
    addModal()
}

loginLink.onclick = () => {
    msgInfo.innerHTML = ""
    connectForm.style.display = 'flex'
    createForm.style.display = 'none'
}

signLink.onclick = () => {
    msgInfo.innerHTML = ""
    connectForm.style.display = 'none'
    createForm.style.display = 'flex'
}

submit.onclick = (e) => {
    e.preventDefault()
    let username = document.getElementById('username')
    let password = document.getElementById('password')

    if (username.value == "" || password.value == "") {
        msgInfo.innerHTML = "Pseudo et (ou) mot de passe vide"
        return
    }
    login(username.value, password.value)
        .then(token => {
            localStorage.setItem('token', token)
            socket.emit('inscritpion', token)
            document.location.href = 'http://localhost:3000/accueil'
        })
        .catch(err => {
            if (!err.err) {
                msgInfo.innerHTML = err.msg
            }
        })
}

submitCreate.onclick = (e) => {
    e.preventDefault()
    let username = document.getElementById('usernameCreate').value
    let password = document.getElementById('passwordCreate').value
    let Confirmpass = document.getElementById('confirmPasswordCreate').value
    if (username == "" || password == "" || Confirmpass == "") {
        msgInfo.innerHTML = "Vérifier les champs avant de valider"
        return
    }
    if ((Confirmpass == "" || password == "") || (password !== Confirmpass)) {
        msgInfo.innerHTML = "Le mot de passe et la confirmation doivent être rempli et identique"
        return
    }

    create(username, password, Confirmpass)
        .then(token => {
            localStorage.setItem('token', token)
            document.location.href = 'http://localhost:3000/accueil'
        })
        .catch(err => {
            if (!err.err) {
                msgInfo.innerHTML = err.msg
            }
        })
}