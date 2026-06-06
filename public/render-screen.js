export default function renderScreen(screen, state, plr, requestAnimationFrame) {
    const context = screen.getContext('2d')
    context.fillStyle = 'white'
    context.globalAlpha = 1;
    context.clearRect(0, 0, screen.width, screen.height) //limpar o canvas

    for (const playerId in state.players) { //renderiza os players
        const player = state.players[playerId]
        context.fillStyle = 'black' //cor do jogadores
        context.globalAlpha = 0.5;
        if (playerId === plr) { context.fillStyle = "red"; context.globalAlpha = 0.9; }
        if (player.buff) {context.fillStyle = "rgb(255, 215, 0)"; context.globalAlpha = 0.9;}
        context.fillRect(player.x, player.y, 1, 1)
    }
    for (const fruitId in state.fruits) { //renderiza as frutas
        const fruit = state.fruits[fruitId]
        if (fruit.mega === true) {
            const r = Math.floor(Math.random() * 255)
            const g = Math.floor(Math.random() * 255)
            const b = Math.floor(Math.random() * 255)

            context.fillStyle = `rgb(${r}, ${g}, ${b})`
        }else{context.fillStyle = "green"}
        context.globalAlpha = 1;
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }
    requestAnimationFrame(() => {
        renderScreen(
            screen,
            state,
            plr,
            requestAnimationFrame
        )
    })
}