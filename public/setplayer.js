let playerId

export default function SetPlayerState() {
    function SetPlayerFunc(id) {
        playerId = id
        if(playerId === ""){}
        if(playerId === " "){}
        localStorage.setItem("playerId", playerId)
        window.location.href = "./Jogo.html"
    }
    return {
        SetPlayerFunc,
    }
}