const caixa = document.getElementById("caixa")
const btnHost = document.getElementById("Join")
const btnJoin = document.getElementById("Host")

const title = document.getElementById("title")

btnHost.onclick = function Host(){
    let divHost = document.createElement("div")
    divHost.className = "divHost"
    divHost.innerHTML = ""

    title.textContent = "Criar"
    caixa.innerHTML = ""
    caixa.appendChild(divHost)
}

btnJoin.onclick = function Join(){
    let divJoin = document.createElement("div")
    divJoin.className = "divJoin"

    title.textContent = "Entrar"
    caixa.innerHTML = ""
    caixa.appendChild(divJoin)
}