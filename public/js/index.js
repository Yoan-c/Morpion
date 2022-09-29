const btnAccept = document.getElementById('modal-accept')
const closeModal = document.getElementById('modal-close')
const loginLink = document.getElementById('login')
const signLink = document.getElementById('sign')
let connectForm = document.getElementById('login-form')
let createForm = document.getElementById('sign-form')
console.log("test")
const addModal = () => {
    let modal = document.getElementById('modal')
    modal.style.display = 'none'
    console.log("a appuyer")
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