window.onload = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        redirectConnect()
    }
    ask(token, 'authorization')
        .then(result => {
            console.log(`test ${result}`)
            // rajouter le socket inscritpion
            // retirer le chargement 
        })
        .catch(error => {
            console("errors")
            redirectConnect()
        })

}