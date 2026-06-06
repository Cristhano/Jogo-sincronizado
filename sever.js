import express from 'express'
import http from 'http'
import CreateGame from './public/game.js'
import { Server } from 'socket.io'

const app = express()
const sever = http.createServer(app)
const sockets = new Server(sever)

app.use(express.static('public'))

const game = CreateGame()
setInterval(() => { game.addFruit({ type: 'add-fruit' }) }, 3000)

game.subscribe((command) => {
    sockets.emit(command.type, command)
    sockets.emit('setup', game.state)
})

sockets.on('connection', (socket) => {
    let playerId = socket.id

    socket.on("myId", (myId) => {
        if (!myId) {
            game.addPlayer({ playerId: playerId, type: 'add-player' })
        } else {
            playerId = myId
            game.addPlayer({ playerId: playerId, type: 'add-player' })
        }
        console.log("Jogador Conectado: " + playerId)
        socket.emit('start', ({playerId: playerId, freq: 300}))
    })

    socket.on('disconnect', () => {
        game.removeplayer({ playerId: playerId, type: 'remove-player' })
    })
    socket.on('move-player', (command) => {
        if (command.type != 'move-player') { return }
        command.playerId = playerId

        game.movePlayer(command)
    })
    socket.on('on-death', (command) => {
        if (command.type != 'on-death') { return }
        console.log("player death: " + command.playerId)
        sockets.emit('recipe-death', command)
    })

})

sever.listen(3000, () => {
    console.log('Sever rodando na porta: 3000')
})