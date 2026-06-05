let playerId = null

export default function SetPlayerState() {
    function SetPlayerFunc(id) {
        playerId = id
        localStorage.setItem("playerId", id)
        window.location.href = "./Jogo.html"
    }
    return {
        SetPlayerFunc,
    }
}