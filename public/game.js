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
    let CurrentKey = ""
    let playerDeath = false

    function UpdateKey(command) {
        CurrentKey = command.keyPressed
    }

    let frequency = 500
    let megafrequency = 200
    let ConstantMove

    function start(command) {
        clearInterval(ConstantMove)
        console.log(CurrentKey)
        const player = command.playerId
        const freq = command.freq

        ConstantMove = setInterval(() => {
            movePlayer({
                playerId: player,
                type: 'move-player',
                keyPressed: CurrentKey
            })
        }, freq)
    }

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
        if (command.type != 'add-player') { return }
        let player = command.playerId
        let X = command.playerX; if (!X) { X = Math.floor(Math.random() * state.screen.width) }
        let Y = command.playerY; if (!Y) { Y = Math.floor(Math.random() * state.screen.height) }
        let buffed = command.buff; if (!buffed) { buffed = false }

        state.players[player] = {
            x: X,
            y: Y,
            cont: 0,
            buff: buffed,
            segiment: [],
            history: []
        }

        NotifyAll({
            type: 'add-player',
            playerId: player,
            playerX: X,
            playerY: Y,
            buff: buffed,
            segiment: [],
            history: []
        })
    }
    function addFruit(command) {
        if (command.type != 'add-fruit') { return }
        let fruit
        if (command.fruitId) { fruit = command.fruitId } else {
            fruit = 'fruit ' + Math.floor(Math.random() * 100000)
        }
        let X = command.fruitX; if (!X) { X = Math.floor(Math.random() * state.screen.width) }
        let Y = command.fruitY; if (!Y) { Y = Math.floor(Math.random() * state.screen.height) }

        let Megafruit = false
        let chanceMegaFruit = Math.floor(Math.random() * 25)

        if (command.mega) { Megafruit = command.mega }
        if (chanceMegaFruit === 5 && !Megafruit) {
            fruit = 'Megafruit ' + Math.floor(Math.random() * 100000); Megafruit = true
            console.log("Mega Fruit Spawned!")
        }
        state.fruits[fruit] = { x: X, y: Y, mega: Megafruit }

        NotifyAll({
            type: 'add-fruit',
            fruitId: fruit,
            fruitX: X,
            fruitY: Y,
            mega: Megafruit
        })
    }

    //remover---------
    function removeplayer(command) {
        if (command.type != 'remove-player') { return }
        delete state.players[command.playerId]

        NotifyAll({
            type: 'remove-player',
            playerId: command.playerId
        })
    }
    function removeFruit(command) {
        if (command.type != 'remove-fruit') { return }
        delete state.fruits[command.fruitId]

        NotifyAll({
            type: 'remove-fruit',
            fruitId: command.fruitId
        })
    }
    //Checa Coilsão
    function checkColision(player, playerId) {
        let playerX = player.x
        let playerY = player.y

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            let fruitX = fruit.x
            let fruitY = fruit.y
            let FruitMega = fruit.mega

            let intervalId

            if (playerX === fruitX & playerY === fruitY) {
                addSegiment(player)
                if (FruitMega === true) {
                    player.cont += 10
                    player.buff = true
                    let i = 5

                    clearInterval(intervalId)
                    start({ playerId: playerId, freq: megafrequency })

                    console.log("Mega Fruit Collect")

                    intervalId = setInterval(() => {
                        console.log("Mega Fruit sai em: ", i)

                        i -= 1

                        if (i <= 0) {
                            start({ playerId: playerId, freq: frequency })
                            player.buff = false
                            i = 5
                            clearInterval(intervalId)
                        }
                    }, 1000)
                } else {
                    player.cont += 1
                }
                removeFruit({ fruitId: fruitId, type: 'remove-fruit' })
            }
        }
    }
    //Mover Jogador------
    function movePlayer(command) {
        if (command.type != 'move-player') { return }
        if (playerDeath) { return }

        const playerId = command.playerId
        const player = state.players[playerId];
        const keyPressed = command.keyPressed
        let Death = false



        function OnDeath() {
            const segiments = player.segiment.length

            if (segiments === 0) { return }

            Death = true

            player.segiment = []
            player.history = []

            player.y = 11;
            player.x = 11;
            player.cont -= 1

            NotifyAll({ type: 'on-death', playerId: command.playerId })
            OnPlayerDeath(playerId)
        }
        function CheckHistory(player) {
            for (const Position of player.history) {
                if (player.x === Position.x && player.y === Position.y) {
                    OnDeath()
                }
            }
        }

        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y > 0) { player.y -= 1 }
                else { player.y = 20 }
            },
            ArrowDown(player) {
                if (player.y < state.screen.width - 1) { player.y += 1 }
                else { player.y = 0 }
            },
            ArrowLeft(player) {
                if (player.x > 0) { player.x -= 1 }
                else { player.x = 20 }
            },
            ArrowRight(player) {
                if (player.x < state.screen.height - 1) { player.x += 1 }
                else { player.x = 0 }
            }
        }
        const MoveFunction = acceptedMoves[keyPressed]

        const maxHistory = (player.segiment.length + 1) * 10

        if (player.history.length > maxHistory) {
            player.history.pop()
        }

        if (player && MoveFunction) {
            MoveFunction(player)
            CheckHistory(player)
            if (Death) { return }
            player.history.unshift({ x: player.x, y: player.y })
            checkColision(player, playerId)
            NotifyAll(command)
            moveSegiment(player)
        }

    }
    function addSegiment(player) {
        player.segiment.push({ x: player.x, y: player.y })
    }
    function moveSegiment(player) {
        let prevX = player.x
        let prevY = player.y

        for (let i = 0; i < player.segiment.length; i++) {
            const segment = player.segiment[i]

            const tempX = segment.x
            const tempY = segment.y

            segment.x = prevX
            segment.y = prevY

            prevX = tempX
            prevY = tempY
        }

    }
    function OnPlayerDeath(player) {
        playerDeath = true
        setTimeout(() => {
            playerDeath = false
            start({ playerId: player, freq: frequency })
        }, 2000)
    }
    return {
        movePlayer,
        addPlayer,
        addFruit,
        removeplayer,
        removeFruit,
        subscribe,
        NotifyAll,
        UpdateKey,
        start,
        state
    };
};
