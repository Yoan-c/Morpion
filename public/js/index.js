const btnAccept = document.getElementById('modal-accept')
const closeModal = document.getElementById('modal-close')
const loginLink = document.getElementById('login')
const signLink = document.getElementById('sign')
let connectForm = document.getElementById('login-form')
let createForm = document.getElementById('sign-form')
let submit = document.getElementById('submit')

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
    connectForm.style.display = 'flex'
    createForm.style.display = 'none'
}

signLink.onclick = () => {
    connectForm.style.display = 'none'
    createForm.style.display = 'flex'
}

submit.onclick = (e) => {
    e.preventDefault()
    let username = document.getElementById('username')
    let password = document.getElementById('password')
    let msgInfo = document.getElementById('msgInfo')
    if (username.value == "" || password.value == "") {
        msgInfo.innerHTML = "Pseudo et (ou) mot de passe vide"
        return
    }
    login(username.value, password.value)
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