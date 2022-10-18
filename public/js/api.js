const URL_API = 'http://localhost:3000/'
const PATH = ''

const redirectConnect = () => {
    document.location.href = URL_API
}

const login = (username, password) => {
    let data = JSON.stringify({ username, password })
    return new Promise((resolve, reject) => {

        fetch(PATH + 'login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json"
                },
                body: data
            }
        )
            .then(result => result.json())
            .then(result => {
                let datas = result.dataSend
                if (datas.status == 200) {
                    resolve(datas.data.token)
                }
                else {
                    let error = {
                        msg: datas.data.message
                    }
                    reject(error)
                }
            })
            .catch(err => {
                let error = {
                    msg: "Une erreur est survenue",
                    err
                }
                reject(error)
            })
    })
}

const create = (username, password, confirmation) => {
    let data = JSON.stringify({ username, password, confirmation })
    return new Promise((resolve, reject) => {
        fetch(PATH + 'create',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json"
                },
                body: data
            }
        )
            .then(result => result.json())
            .then(result => {
                let datas = result.dataSend
                if (datas.status == 200) {
                    resolve(datas.data.token)
                }
                else {
                    let error = {
                        msg: datas.data.msg
                    }
                    reject(error)
                }
            })
            .catch(err => {
                let error = {
                    msg: "Une erreur est survenue",
                    err
                }
                reject(error)
            })
    })
}

const ask = (token, url) => {
    let data = JSON.stringify({ token })
    return new Promise((resolve, reject) => {

        fetch(PATH + url,
            {
                method: 'POST',
                headers: {
                    "authorization": `baerer ${token}`
                },
            }
        )
            .then(result => result.json())
            .then(result => {
                let data = result.data
                if (data.isConnected) {
                    resolve(data.isConnected)
                }
                else {
                    reject(false)
                }
            })
            .catch(err => {
                let error = {
                    msg: "Une erreur est survenue",
                    err
                }
                reject(error)
            })
    })
}