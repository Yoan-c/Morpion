let deconnect = document.getElementById('deconnect')
const token = localStorage.getItem('token')
deconnect.onclick = () => {
    ask(token, "deconnexion")
        .then(data => {
            if (data) {
                redirectConnect()
                localStorage.removeItem('token')
            }
        })
        .catch(err => {
            redirectConnect()
            localStorage.removeItem('token')
        })
}