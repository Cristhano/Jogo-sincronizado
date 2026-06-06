export default function createKeybordListenes(game) {
    const state = {
        obsevers: [], //observadores
        playerId: null
    }
    function registerPlayerId(playerId){
        state.playerId = playerId
    }

    function subscribe(ObseverFunction) { // Registrar Observador
        state.obsevers.push(ObseverFunction)
    }
    function NotifyAll(command) {
        for (const ObseverFunction of state.obsevers) {
            ObseverFunction(command)
        }
    }

    document.addEventListener("keydown", handleKeyDown) //input

    function handleKeyDown(event) {
        const keyPressed = event.key
        const command = {
            type: 'current-key',
            playerId: state.playerId,
            keyPressed
        }
        game.UpdateKey(command)
    }

    return {
        subscribe,
        registerPlayerId
    }
}