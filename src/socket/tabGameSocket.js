let tabGameSocket = []

function addtabGameSocket(id, oldTab, newTab) {

    let searchTabGame = tabGameSocket.find(tab => tab.id == id)

    if (!searchTabGame)
        tabGameSocket = [...tabGameSocket, { id, oldTab, newTab }]
    return tabGameSocket
}


function modifTabSocket(tabNow) {
    return tabGameSocket.find(tab => {
        if (tab.id == tabNow.id) {
            tab.oldTab = tab.newTab
            tab.newTab = tabNow.newTab
        }
    })
}

function searchtabGameSocket(id) {
    return tabGameSocket.find(tab => tab.id == id)
}

function resetTab(tab) {
    for (let i = 0; i < 9; i++) {
        tab.oldTab[i] = false
        tab.newTab[i] = false
    }
    return tab
}

module.exports = {
    tabGameSocket, addtabGameSocket, modifTabSocket, searchtabGameSocket, resetTab
}