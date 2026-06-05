export default function CreateGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 21,
            height: 21
        }
    }

    const obsevers = []

    function subscribe(ObseverFunction) { // Registrar Observador
        obsevers.push(ObseverFunction)
    }
    function NotifyAll(command) {
        for (const ObseverFunction of obsevers) {
            ObseverFunction(command)
        }
    }

    //Adicionar----------
    function addPlayer(command) {
        let player = command.playerId
        let X = command.playerX; if (X === undefined) { X = Math.floor(Math.random() * state.screen.width) }
        let Y = command.playerY; if (Y === undefined) { Y = Math.floor(Math.random() * state.screen.height) }

        state.players[player] = {
            x: X,
            y: Y,
            cont: 0
        }

        NotifyAll({
            type: 'add-player',
            playerId: player,
            playerX: X,
            playerY: Y
        })
    }
    function addFruit(command) {
        let fruit
        if(command.fruitId){fruit = command.fruitId}else{
            fruit = 'fruit ' + Math.floor(Math.random() * 100)
        }
        let X = command.fruitX; if (!X) { X = Math.floor(Math.random() * state.screen.width) }
        let Y = command.fruitY; if (!Y) { Y = Math.floor(Math.random() * state.screen.height) }

        state.fruits[fruit] = { x: X, y: Y }
    }

    //remover---------
    function removeplayer(command) {
        delete state.players[command.playerId]

        NotifyAll({
            type: 'remove-player',
            playerId: command.playerId
        })
    }
    function removeFruit(fruit) {
        delete state.fruits[fruit]
    }
    //Checa Coilsão
    function checkColision(player) {
        let playerX = player.x
        let playerY = player.y

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            let fruitX = fruit.x
            let fruitY = fruit.y

            if (playerX === fruitX & playerY === fruitY) {
                removeFruit(fruitId)
                player.cont += 1
                addFruit({ fruitId: 'fruit' + Math.floor(Math.random() * 10), random: true })
                console.log(player.cont)
            }
        }
    }
    //Mover Jogador------
    function movePlayer(command) {
        if (command.type != 'move-player') { return }

        const playerId = command.playerId
        const player = state.players[playerId];
        const keyPressed = command.keyPressed

        const acceptedMoves = {
            ArrowUp(player) { if (player.y > 0) { player.y -= 1 } },
            ArrowDown(player) { if (player.y < state.screen.width - 1) { player.y += 1 } },
            ArrowLeft(player) { if (player.x > 0) { player.x -= 1 } },
            ArrowRight(player) { if (player.x < state.screen.height - 1) { player.x += 1 } }
        }
        const MoveFunction = acceptedMoves[keyPressed]

        if (player && MoveFunction) {
            MoveFunction(player)
            checkColision(player)
            NotifyAll(command)

            console.log("move: " + player)
            console.log(state)
        }

    }

    return {
        movePlayer,
        addPlayer,
        addFruit,
        removeplayer,
        removeFruit,
        subscribe,
        NotifyAll,
        state
    };
};