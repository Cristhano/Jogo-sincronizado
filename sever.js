import express from 'express'
import http from 'http'
import CreateGame from './public/game.js'
import { Server } from 'socket.io'
import { type } from 'os'

const app = express()
const sever = http.createServer(app)
const sockets = new Server(sever)

app.use(express.static('public'))

const game = CreateGame()
game.addFruit({type: 'add-fruit'})

game.subscribe((command) => {
    sockets.emit(command.type, command)
    sockets.emit('setup', game.state)
})

sockets.on('connection', (socket) => {
    let playerId = socket.id

    socket.on("myId", (myId) => {
        if (!myId) { game.addPlayer({ playerId }) } else {
            playerId = myId
        }
        console.log("Jogador Conectado: " + playerId)
        game.addPlayer({ playerId: playerId, type: 'add-player' })
        socket.emit('start', (playerId))
    })

    socket.on('disconnect', () => {
        game.removeplayer({ playerId: playerId })
    })
    socket.on('move-player', (command) => {
        command.type = 'move-player'
        command.playerId = playerId

        game.movePlayer(command)
    })

})

sever.listen(3000, () => {
    console.log('Sever rodando na porta: 3000')
})